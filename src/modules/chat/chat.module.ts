import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { chatEntity } from 'src/model/chat.entity';
import OpenAI from 'openai';
import { sessionEntity } from 'src/model/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([chatEntity, sessionEntity])],
  controllers: [ChatController],
  providers: [ChatService, OpenAI],
})
export class ChatModule { }
