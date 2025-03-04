import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import OpenAI from 'openai';
import { templateEntity } from 'src/model/templates.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { contentEntity } from 'src/model/content.entity';
import { userTokenEntity } from 'src/model/userToken.entity';
import { UsertokenService } from '../usertoken/usertoken.service';

@Module({
  imports: [TypeOrmModule.forFeature([templateEntity, contentEntity, userTokenEntity])],
  controllers: [TemplatesController],
  providers: [TemplatesService, OpenAI, UsertokenService],
})
export class TemplatesModule { }
