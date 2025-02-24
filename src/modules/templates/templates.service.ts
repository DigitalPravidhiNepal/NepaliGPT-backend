import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTemplateDto, generateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { templateEntity } from 'src/model/templates.entity';
import { ILike, Repository } from 'typeorm';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { userEntity } from 'src/model/user.entity';
import { TransformationType } from 'class-transformer';

@Injectable()
export class TemplatesService {
  private readonly openai: OpenAI
  constructor(
    @InjectRepository(templateEntity)
    private readonly templateRepo: Repository<templateEntity>,
    private configService: ConfigService,

  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    })
  }
  //create template
  async create(createTemplateDto: CreateTemplateDto) {
    try {
      const { name, description, pricing, category, promptTemplate } = createTemplateDto;
      const template = new templateEntity()
      template.name = name;
      template.description = description;
      template.pricing = pricing;
      template.category = category;
      template.promptTemplate = promptTemplate;
      return await this.templateRepo.save(template)
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }

  //generate content
  async generate(id: string, GenerateDto: generateDto, userId: string) {
    try {
      const { creativity, tone, inputData, maxToken, language } = GenerateDto;
      const template = await this.templateRepo.findOne({ where: { id } });
      const { promptTemplate } = template;
      // Convert creativity to OpenAI temperature value
      const temperatureMapping = {
        Low: 0.2,
        Medium: 0.7,
        High: 1.0,
      };
      const temperature = temperatureMapping[creativity] || 0.7; // Default: Medium
      // Construct dynamic prompt
      const prompt = `${promptTemplate} where user inputs are ${inputData} in ${language} 
    The tone should be ${tone}.`;

      // Call OpenAI API
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxToken,
        temperature: temperature,
      });
      if (response) {
        // Extract content and remove extra quotes
        const generatedContent = response.choices
          .map(choice => choice.message?.content.replace(/^"|"$/g, '')) // Removes leading & trailing quotes
          .join("\n");

        template.content = generatedContent;
        template.user = { id: userId } as userEntity;
        return await this.templateRepo.save(template);
      }

    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  //filter templates by category
  async filterByCategory(categoryName) {
    try {
      const templates = await this.templateRepo.find({ where: { category: ILike(categoryName) } });
      return templates;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  //update status as true for saving
  async updateStatus(id: string, userId: string) {
    try {
      const template = await this.templateRepo.findOne({ where: { id } });
      if (!template) {
        throw new NotFoundException("Template not found");
      }
      if (template.status === true) {
        throw new BadRequestException("Template has already been saved");
      }
      template.status = true;
      template.user = { id: userId } as userEntity;
      return await this.templateRepo.save(template);
    } catch (e) {
      throw e instanceof NotFoundException || e instanceof BadRequestException
        ? e
        : new BadRequestException(e.message);
    }
  }

  async unsave(id: string) {
    try {
      const template = await this.templateRepo.findOne({ where: { id } });
      if (!template) {
        throw new NotFoundException("Template not found");
      }
      if (template.status === false) {
        throw new BadRequestException("Template has already been removed");
      }
      template.status = false;
      return await this.templateRepo.save(template);
    } catch (e) {
      throw e instanceof NotFoundException || e instanceof BadRequestException
        ? e
        : new BadRequestException(e.message);
    }
  }

  //get all templates
  async findAll() {
    try {
      await this.templateRepo.find({
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
        }
      })
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }


  findOne(id: number) {
    return `This action returns a #${id} template`;
  }

  remove(id: number) {
    return `This action removes a #${id} template`;
  }
}
