import { Module } from '@nestjs/common';
import { TextToSpeechService } from './text-to-speech.service';
import { TextToSpeechController } from './text-to-speech.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ttsEntity } from 'src/model/tts.entity';
import OpenAI from 'openai';
import { ConvertAudio } from 'src/helper/utils/conversion';
import { UploadSoundService } from 'src/helper/utils/uploadSound';
import { PricingEntity } from 'src/model/pricing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ttsEntity, PricingEntity])],
  controllers: [TextToSpeechController],
  providers: [TextToSpeechService, OpenAI, UploadSoundService, ConvertAudio, Object],
})
export class TextToSpeechModule { }
