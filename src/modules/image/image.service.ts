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
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  async generateImage(generateImageDto: GenerateImageDto, id?: string) {

    const { title, artStyle, lightingStyle, moodStyle, imageSize, numberOfImages } = generateImageDto;


    let fullPrompt = title;
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

  //update status as true for saving
  async updateStatus(id: string, userId: string) {
    try {
      const image = await this.imageRepository.findOne({ where: { id } });
      if (!image) {
        throw new NotFoundException("Image not found");
      }
      if (image.status === true) {
        return new BadRequestException("Image have already been saved");
      }
      image.status = true;
      return await this.imageRepository.save(image);
    } catch (e) {
      throw e instanceof NotFoundException || e instanceof BadRequestException
        ? e
        : new BadRequestException(e.message);
    }
  }

  async unsave(id: string) {
    try {
      const image = await this.imageRepository.findOne({ where: { id } });
      if (!image) {
        throw new NotFoundException("Image not found");
      }
      if (image.status === false) {
        return new BadRequestException("Image have already been removed");
      }
      image.status = false;
      return await this.imageRepository.save(image);
    } catch (e) {
      throw e instanceof NotFoundException || e instanceof BadRequestException
        ? e
        : new BadRequestException(e.message);
    }
  }




  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
