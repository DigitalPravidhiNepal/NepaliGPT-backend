import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { codeEntity } from 'src/model/code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { PricingEntity } from 'src/model/pricing.entity';


@Module({
  imports: [TypeOrmModule.forFeature([codeEntity, PricingEntity])],
  controllers: [CodeController],
  providers: [CodeService, OpenAI],
})
export class CodeModule { }
