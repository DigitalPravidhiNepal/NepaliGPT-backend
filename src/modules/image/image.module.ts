import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import OpenAI from 'openai';
import { TypeOrmModule } from '@nestjs/typeorm';
import { imageEntity } from 'src/model/image.entity';
import { UploadService } from 'src/helper/utils/files_upload';

@Module({
  imports: [TypeOrmModule.forFeature([imageEntity])],
  controllers: [ImageController],
  providers: [ImageService, OpenAI, UploadService],
  exports: [ImageService]
})
export class ImageModule { }
