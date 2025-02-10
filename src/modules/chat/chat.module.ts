import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { botEntity } from 'src/model/bot.entity';
import { chatEntity } from 'src/model/chat.entity';
import OpenAI from 'openai';

@Module({
  imports: [TypeOrmModule.forFeature([botEntity, chatEntity])],
  controllers: [ChatController],
  providers: [ChatService, OpenAI],
})
export class ChatModule { }
