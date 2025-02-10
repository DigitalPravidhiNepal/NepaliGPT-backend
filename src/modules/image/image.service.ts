import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GenerateImageDto } from './dto/create-image.dto';
import OpenAI from "openai"
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { imageEntity } from 'src/model/image.entity';
import { userEntity } from 'src/model/user.entity';
import { Images } from 'openai/resources';
@Injectable()
export class ImageService {
  constructor(
    private openai: OpenAI,
    @InjectRepository(imageEntity)
    private imageRepository: Repository<imageEntity>
  ) {
    // Initialize OpenAI API client
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env
    });
  }
  async generateImage(generateImageDto: GenerateImageDto, id?: string): Promise<any> {

    const { title, artStyle, lightingStyle, moodStyle, imageSize, numberOfImages } = generateImageDto;

    // Construct the prompt dynamically based on the DTO values
    let fullPrompt = title;  // Start with the title
    if (artStyle) fullPrompt += `, in the style of ${artStyle}`;
    if (lightingStyle) fullPrompt += `, with ${lightingStyle} lighting`;
    if (moodStyle) fullPrompt += `, evoking a ${moodStyle} mood`;

    try {
      const response = await this.openai.images.generate({

        model: 'dall-e-3',
        prompt: fullPrompt,
        n: numberOfImages,
        size: imageSize
      });

      // Get the URL of the generated image
      const imageUrl = response.data[0].url
      if (imageUrl && id) {
        const Images = new imageEntity();
        Images.image = imageUrl;
        Images.prompt = fullPrompt;
        Images.user = { id } as userEntity;
        await this.imageRepository.save(Images);
      }

      return {
        image: imageUrl, // Return the image URL
        success: true
      };

    } catch (error) {
      throw new BadRequestException(error.response?.data || 'Error generating image');
    }
  }

  async findAll(id: string) {
    try {
      const images = await this.imageRepository.find({ where: { user: { id } }, select: { id: true, createdAt: true, image: true } });
      return images;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  // update(id: number, updateImageDto: UpdateImageDto) {
  //   return `This action updates a #${id} image`;
  // }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
