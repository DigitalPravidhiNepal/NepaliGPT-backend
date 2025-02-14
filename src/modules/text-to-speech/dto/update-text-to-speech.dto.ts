import { PartialType } from '@nestjs/swagger';
import { CreateTextToSpeechDto } from './create-text-to-speech.dto';

export class UpdateTextToSpeechDto extends PartialType(CreateTextToSpeechDto) {}
