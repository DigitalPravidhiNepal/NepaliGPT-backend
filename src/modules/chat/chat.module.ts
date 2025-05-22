import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { chatEntity } from 'src/model/chat.entity';
import OpenAI from 'openai';
import { sessionEntity } from 'src/model/session.entity';
import { UploadService } from 'src/helper/utils/files_upload';
import { PricingEntity } from 'src/model/pricing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([chatEntity, sessionEntity, PricingEntity])],
  controllers: [ChatController],
  providers: [ChatService, OpenAI],
})
export class ChatModule { }
