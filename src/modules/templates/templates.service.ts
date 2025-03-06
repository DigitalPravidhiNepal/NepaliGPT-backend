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
import { contentEntity } from 'src/model/content.entity';
import { userTokenEntity } from 'src/model/userToken.entity';
import { UsertokenService } from '../usertoken/usertoken.service';

@Injectable()
export class TemplatesService {
  private readonly openai: OpenAI
  constructor(
    @InjectRepository(templateEntity)
    private readonly templateRepo: Repository<templateEntity>,
    @InjectRepository(contentEntity)
    private readonly contentRepo: Repository<contentEntity>,
    @InjectRepository(userTokenEntity)
    private readonly userTokenRepository: Repository<userTokenEntity>,
    private configService: ConfigService,
    private userTokenService: UsertokenService

  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    })
  }
  //create template
  async create(createTemplateDto: CreateTemplateDto) {
    try {
      const { title, description, pricing, category, promptTemplate, fields } = createTemplateDto;
      const template = new templateEntity()
      template.title = title;
      template.description = description;
      template.pricing = pricing;
      template.category = category;
      template.promptTemplate = promptTemplate;
      template.fields = fields;
      return await this.templateRepo.save(template)
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }
  async generate(id: string, dto: generateDto, userId: string) {
    try {
      const { maxToken, creativity, language, userInputs } = dto;

      // Fetch the template
      const template = await this.templateRepo.findOne({ where: { id } });
      if (!template) {
        throw new NotFoundException('Template not found');
      }

      // Replace placeholders with user-provided values
      let finalPrompt = template.promptTemplate;
      Object.keys(userInputs).forEach((key) => {
        const regex = new RegExp(`\\{${key}\\}`, 'g'); // Match all occurrences
        finalPrompt = finalPrompt.replace(regex, userInputs[key]);
      });

      // Append language instruction
      finalPrompt += ` (Write in ${language} language.)`;
      console.log(finalPrompt);
      // Convert creativity to OpenAI temperature value
      const temperatureMapping: Record<string, number> = {
        Low: 0.2,
        Medium: 0.7,
        High: 1.0,
      };
      const temperature = temperatureMapping[creativity] || 0.7; // Default: Medium
      const token = await this.userTokenRepository.findOne({ where: { user: { id: userId } } });
      if (!token) {
        throw new BadRequestException("Please buy token to use the service");
      }
      if (token.remainingTokens === 0) {
        throw new BadRequestException("Token has been finished. Please buy token to use the service")
      }
      // Call OpenAI API
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: finalPrompt }],
        max_tokens: maxToken,
        temperature: temperature,
      });
      if (response) {
        // Extract and process generated content
        const generatedContent = response.choices
          .map(choice => choice.message?.content?.trim() ?? '') // Ensure content exists
          .join("\n");
        // Save generated content
        const Content = new contentEntity();
        Content.content = generatedContent;
        Content.user = { id: userId } as userEntity;
        Content.template = { id } as templateEntity;
        await this.contentRepo.save(Content)
        const usedToken = response.usage.total_tokens;

        const remainingToken = await this.userTokenService.deductTokens(userId, usedToken);
        return {
          content: Content.content,
          remainingToken: remainingToken
        };
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

  //create template
  async update(id: string, updateTemplateDto: UpdateTemplateDto) {
    try {
      const template = await this.templateRepo.findOne({ where: { id } });
      if (!template) {
        throw new NotFoundException("Template not found");
      }
      Object.assign(template, updateTemplateDto)
      return {
        message: "updated successfully",
        template: await this.templateRepo.save(template)
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }

  //update status as true for saving
  async updateStatus(id: string, userId: string) {
    try {
      const Content = await this.contentRepo.findOne({ where: { id } });
      if (!Content) {
        throw new NotFoundException("Content not found");
      }
      if (Content.status === true) {
        throw new BadRequestException("Content has already been saved");
      }
      Content.status = true;
      Content.user = { id: userId } as userEntity;
      return await this.templateRepo.save(Content);
    } catch (e) {
      throw e instanceof NotFoundException || e instanceof BadRequestException
        ? e
        : new BadRequestException(e.message);
    }
  }

  async unsave(id: string) {
    try {
      const content = await this.contentRepo.findOne({ where: { id } });
      if (!content) {
        throw new NotFoundException("Content not found");
      }
      if (content.status === false) {
        throw new BadRequestException("Content has already been removed");
      }
      content.status = false;
      return await this.templateRepo.save(content);
    } catch (e) {
      throw e instanceof NotFoundException || e instanceof BadRequestException
        ? e
        : new BadRequestException(e.message);
    }
  }

  //get all templates
  async findAll() {
    try {
      return await this.templateRepo.find({
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          pricing: true,
        }
      })
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }


  async findOne(id: string) {
    try {
      const template = await this.templateRepo.findOne({ where: { id } });
      if (!template) {
        throw new NotFoundException("template not found");
      }
      return template;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async remove(id: string) {
    try {
      const template = await this.templateRepo.findOne({ where: { id } });
      if (!template) {
        throw new NotFoundException("template not found");
      }
      return await this.templateRepo.remove(template);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
