import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTemplateDto, generateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { templateEntity } from 'src/model/templates.entity';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

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

  async generate(id: string, GenerateDto: generateDto) {
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
      const prompt = `${promptTemplate} ${inputData} in ${language} 
    The tone should be ${tone}.`;

      // Call OpenAI API
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxToken,
        temperature: temperature,
      });
      // Extract content and remove extra quotes
      const generatedContent = response.choices
        .map(choice => choice.message?.content.replace(/^"|"$/g, '')) // Removes leading & trailing quotes
        .join("\n");

      template.content = generatedContent;
      return await this.templateRepo.save(template);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  findAll() {
    return `This action returns all templates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} template`;
  }

  update(id: number, updateTemplateDto: UpdateTemplateDto) {
    return `This action updates a #${id} template`;
  }

  remove(id: number) {
    return `This action removes a #${id} template`;
  }
}
