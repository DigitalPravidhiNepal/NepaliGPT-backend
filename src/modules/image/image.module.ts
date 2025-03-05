import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import OpenAI from 'openai';
import { TypeOrmModule } from '@nestjs/typeorm';
import { imageEntity } from 'src/model/image.entity';
import { UploadService } from 'src/helper/utils/files_upload';
import { userTokenEntity } from 'src/model/userToken.entity';
import { UsertokenService } from '../usertoken/usertoken.service';
import { CalculateUsedToken } from 'src/helper/utils/get-tokencost';

@Module({
  imports: [TypeOrmModule.forFeature([imageEntity, userTokenEntity])],
  controllers: [ImageController],
  providers: [ImageService, OpenAI, UploadService, UsertokenService, CalculateUsedToken],
  exports: [ImageService]
})
export class ImageModule { }
