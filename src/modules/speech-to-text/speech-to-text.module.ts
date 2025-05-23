import { Module } from '@nestjs/common';
import { SpeechToTextService } from './speech-to-text.service';
import { SpeechToTextController } from './speech-to-text.controller';
import OpenAI from 'openai';
import { ConvertAudio } from 'src/helper/utils/conversion';
import { TypeOrmModule } from '@nestjs/typeorm';
import { sttEntity } from 'src/model/stt.entity';
import { UploadSoundService } from 'src/helper/utils/uploadSound';
import { PricingEntity } from 'src/model/pricing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([sttEntity, PricingEntity])],
  controllers: [SpeechToTextController],
  providers: [SpeechToTextService, OpenAI, UploadSoundService, ConvertAudio],
})
export class SpeechToTextModule { }
