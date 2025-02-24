import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { botEntity } from 'src/model/bot.entity';
import { Repository } from 'typeorm';
import OpenAI from "openai"
import { chatEntity } from 'src/model/chat.entity';
import { userEntity } from 'src/model/user.entity';
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(botEntity)
    private readonly botRepository: Repository<botEntity>,
    @InjectRepository(chatEntity)
    private readonly chatRepository: Repository<chatEntity>,
    private openai: OpenAI,
  ) {
    // Initialize OpenAI API client
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env
    });
  }
  create(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  async findAll(id: string, botId) {
    try {
      const chat = await this.chatRepository.find({ where: { user: { id }, bot: { id: botId } } });
      return chat;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  async chat(createChatDto: CreateChatDto, id: string): Promise<string> {
    try {
      const { prompt, botId } = createChatDto;
      const bot = await this.botRepository.findOne({ where: { id: botId } });
      if (!bot) throw new Error('Bot not found');
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: bot.instructions },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 400
      });
      const answer = response.choices[0]?.message?.content || "No response from AI.";
      if (answer) {
        const chat = new chatEntity();
        chat.prompt = prompt;
        chat.response = answer;
        chat.bot = bot;
        chat.user = { id } as userEntity;
        await this.chatRepository.save(chat);
      }
      return answer;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async getBots() {
    try {
      return await this.botRepository.find();
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }
  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
