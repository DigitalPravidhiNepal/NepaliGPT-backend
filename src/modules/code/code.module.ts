import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { codeEntity } from 'src/model/code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import OpenAI from 'openai';


@Module({
  imports: [TypeOrmModule.forFeature([codeEntity])],
  controllers: [CodeController],
  providers: [CodeService, OpenAI],
})
export class CodeModule { }
