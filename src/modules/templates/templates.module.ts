import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import OpenAI from 'openai';
import { templateEntity } from 'src/model/templates.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([templateEntity])],
  controllers: [TemplatesController],
  providers: [TemplatesService, OpenAI],
})
export class TemplatesModule { }
