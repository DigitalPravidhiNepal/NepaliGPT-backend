import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import OpenAI from 'openai';

@Module({
  controllers: [ImageController],
  providers: [ImageService, OpenAI],
  exports: [ImageService]
})
export class ImageModule { }
