import { Test, TestingModule } from '@nestjs/testing';
import { TextToSpeechController } from './text-to-speech.controller';
import { TextToSpeechService } from './text-to-speech.service';

describe('TextToSpeechController', () => {
  let controller: TextToSpeechController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextToSpeechController],
      providers: [TextToSpeechService],
    }).compile();

    controller = module.get<TextToSpeechController>(TextToSpeechController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
