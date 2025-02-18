import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import OpenAI from 'openai';

@Module({
  controllers: [TemplatesController],
  providers: [TemplatesService, OpenAI],
})
export class TemplatesModule { }
