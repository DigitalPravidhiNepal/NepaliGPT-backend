import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto, searchChat, SessionId } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import OpenAI from "openai"
import { chatEntity } from 'src/model/chat.entity';
import { userEntity } from 'src/model/user.entity';
import { sessionEntity } from 'src/model/session.entity';
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(chatEntity)
    private readonly chatRepository: Repository<chatEntity>,
    @InjectRepository(sessionEntity)
    private readonly sessionRepository: Repository<sessionEntity>,
    private openai: OpenAI,
  ) {
    // Initialize OpenAI API client
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env
    });
  }

  async chat(createChatDto: CreateChatDto, id: string, sessionDto?: SessionId) {
    try {
      const { prompt } = createChatDto;
      const { sessionId } = sessionDto;
      let session: sessionEntity;

      // If no sessionId is provided, create a new session
      if (!sessionId) {
        session = new sessionEntity();
        session.user = { id } as userEntity;
        session.title = prompt.substring(0, 30); // Set default title as first 30 chars of the first message
        session = await this.sessionRepository.save(session);
      } else {
        session = await this.sessionRepository.findOne({ where: { id: sessionId } });
        if (!session) throw new Error('Session not found');
      }
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });
      const answer = response.choices[0]?.message?.content || "No response from AI.";
      if (answer) {
        const chat = new chatEntity();
        chat.prompt = prompt;
        chat.response = answer;
        chat.session = session;
        chat.user = { id } as userEntity;
        await this.chatRepository.save(chat);
      }
      return {
        response: answer,
        sessionId: session.id
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async getChatSessions(userId: string): Promise<sessionEntity[]> {
    return await this.sessionRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getChatHistory(sessionId: string, userId: string) {
    return await this.chatRepository.find({
      where: { session: { id: sessionId }, user: { id: userId } },
      order: { createdAt: 'ASC' }, // Oldest messages first
      select: { id: true, prompt: true, response: true, session: { id: true } }
    });
  }

  async searchChat(id: string, query: string) {
    return await this.chatRepository.find({
      where: [
        {
          user: { id }, prompt: ILike(`%${query}%`)
        },
        {
          user: { id }, response: ILike(`%${query}%`)
        }
      ], relations: ['session'],
      select: { id: true, prompt: true, response: true, session: { id: true, title: true } },
      order: { createdAt: 'DESC' }
    })

  }


  async renameSessionTitle(sessionId: string, newTitle: string): Promise<sessionEntity> {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session not found');

    session.title = newTitle;
    return await this.sessionRepository.save(session);
  }

  async deleteChat(id: string, sessionId: string) {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId, user: { id } } });
    if (!session) throw new NotFoundException('Session not found');
    const remove = await this.sessionRepository.remove(session);
    if (remove) {
      return {
        status: true
      }
    } else {
      throw new BadRequestException("Chat couldnot be deleted")
    }
  }
}
