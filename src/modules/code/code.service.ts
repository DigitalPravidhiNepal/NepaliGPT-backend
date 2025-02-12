import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCodeDto } from './dto/create-code.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { codeEntity } from 'src/model/code.entity';
import { Repository } from 'typeorm';
import { userEntity } from 'src/model/user.entity';

@Injectable()
export class CodeService {
  constructor(
    private openai: OpenAI,
    @InjectRepository(codeEntity)
    private codeRepository: Repository<codeEntity>
  ) {

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  async generateCode(createCodeDto: CreateCodeDto, id: string) {
    try {
      const { title, language, description } = createCodeDto;
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that communicates in ${language}.`,
          },
          {
            role: 'user',
            content: `Please generate a response with the title "${title}" and description: "${description}" in ${language}.`,
          },
        ],
      });
      const generatedCode = response.choices[0].message.content;
      const code = new codeEntity();
      code.title = title;
      code.language = language;
      code.description = description;
      code.user = { id } as userEntity;
      code.code = generatedCode;
      return await this.codeRepository.save(code);
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }


  create(createCodeDto: CreateCodeDto) {
    return 'This action adds a new code';
  }

  async findAll(id: string) {
    try {
      const codes = await this.codeRepository.find({ where: { user: { id } } });
      return codes;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findOne(id: string) {
    try {
      const code = await this.codeRepository.findOne({ where: { id } });
      return code;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  update(id: number, updateCodeDto: UpdateCodeDto) {
    return `This action updates a #${id} code`;
  }

  remove(id: number) {
    return `This action removes a #${id} code`;
  }
}
