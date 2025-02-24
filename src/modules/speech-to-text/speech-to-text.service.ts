import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpeechToTextDto } from './dto/create-speech-to-text.dto';
import OpenAI from 'openai';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';
import { sttEntity } from 'src/model/stt.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userEntity } from 'src/model/user.entity';
@Injectable()
export class SpeechToTextService {
  constructor(
    private readonly openai: OpenAI,
    @InjectRepository(sttEntity)
    private readonly sttRepository: Repository<sttEntity>
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  async transcribeAudio(id: string, createSpeechToTextDto: CreateSpeechToTextDto) {
    try {
      const { title, audio, description } = createSpeechToTextDto;

      // Download the audio file to the server
      const filePath = await downloadAudioFromCloudinary(audio);
      const fileStream = fs.createReadStream(filePath);

      const contextMessage = `Title: ${title}\nDescription: ${description}\n\nNow transcribe the following audio:`;

      // Create an instance of FormData
      const formData = new FormData();

      // Append the file stream to form data with proper handling
      formData.append('file', fileStream, path.basename(filePath));  // Filename should be the actual file name

      // Append other required fields
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');
      formData.append('prompt', contextMessage);

      // Send the file to OpenAI for transcription
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            ...formData.getHeaders(), // Automatically sets the correct content-type
          },
        }
      );

      const transcription = response.data.text;

      // Delete the file from the server after use
      fs.unlinkSync(filePath);
      if (transcription) {
        const stt = new sttEntity();
        stt.title = title;
        stt.audio = audio;
        stt.description = description;
        stt.transcription = transcription;
        stt.user = { id } as userEntity;
        await this.sttRepository.save(stt);
      }

      return {
        title,
        description,
        transcription,
        audio,
      };
    } catch (error) {
      // Log the full error response for debugging
      console.error('Full error response:', error.response ? error.response.data : error.message);
      throw new Error(`Speech-to-text failed: ${error.message}`);
    }
  }
  async findAll(id: string) {
    try {
      return await this.sttRepository.find({ where: { user: { id } } });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findOne(id: string) {
    try {
      return await this.sttRepository.findOne({ where: { id } });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async updateStatus(id: string, userId: string) {
    try {
      const stt = await this.sttRepository.findOne({ where: { id } });
      if (!stt) {
        throw new NotFoundException("Template not found");
      }

      if (stt.status === true) {
        throw new BadRequestException("Code has already been saved.");
      }

      stt.status = true;
      stt.user = { id: userId } as userEntity;

      return await this.sttRepository.save(stt);
    } catch (e) {
      throw e instanceof NotFoundException || e instanceof BadRequestException
        ? e
        : new BadRequestException(e.message);
    }
  }

}

// Function to download the audio file from Cloudinary
async function downloadAudioFromCloudinary(url: string): Promise<string> {
  const fileName = 'audio_file.mp3'; // Adjust file name and extension based on the file type
  const filePath = path.join(__dirname, fileName);

  // Download the file and save it locally
  const response = await axios.get(url, { responseType: 'stream' });
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(filePath));
    writer.on('error', (error) => reject(error));
  });
}





//   update(id: number, updateSpeechToTextDto: UpdateSpeechToTextDto) {
//     return `This action updates a #${id} speechToText`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} speechToText`;
//   }
// }
