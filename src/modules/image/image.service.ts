import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GenerateImageDto } from './dto/create-image.dto';
import OpenAI from "openai"
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { imageEntity } from 'src/model/image.entity';
import { userEntity } from 'src/model/user.entity';
import { Images } from 'openai/resources';
import { UploadService } from 'src/helper/utils/files_upload';
import { userTokenEntity } from 'src/model/userToken.entity';
import { UsertokenService } from '../usertoken/usertoken.service';
import { CalculateUsedToken } from 'src/helper/utils/get-tokencost';
@Injectable()
export class ImageService {
  constructor(
    private openai: OpenAI,
    @InjectRepository(imageEntity)
    private imageRepository: Repository<imageEntity>,
    @InjectRepository(userTokenEntity)
    private userTokenRepository: Repository<userTokenEntity>,
    private uploadService: UploadService,
    private usertokenService: UsertokenService,
    private calculateUsedToken: CalculateUsedToken
  ) {
    // Initialize OpenAI API client
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  async generateImage(generateImageDto: GenerateImageDto, id?: string) {
    const {
      title,
      artStyle,
      lightingStyle,
      moodStyle,
      imageSize,
      negative_keywords,
    } = generateImageDto;

    console.log('Generating image with:', generateImageDto);

    const dallE3Sizes = ['1024x1024', '1792x1024', '1024x1792'];
    if (!dallE3Sizes.includes(imageSize)) {
      throw new BadRequestException('The size is not supported.');
    }

    // Optional: Basic prompt content filter
    const forbiddenWords = ['nude', 'blood', 'violence', 'weapon', 'kill', 'dead'];
    const fullPromptCandidate = `${title} ${artStyle ?? ''} ${lightingStyle ?? ''} ${moodStyle ?? ''} ${negative_keywords ?? ''}`.toLowerCase();
    if (forbiddenWords.some(word => fullPromptCandidate.includes(word))) {
      throw new BadRequestException('Your prompt contains restricted words. Please revise your request.');
    }

    // Build the prompt
    let fullPrompt = title;
    if (artStyle) fullPrompt += `, in the style of ${artStyle}`;
    if (lightingStyle) fullPrompt += `, with ${lightingStyle} lighting`;
    if (moodStyle) fullPrompt += `, evoking a ${moodStyle} mood`;
    if (negative_keywords) fullPrompt += `, avoiding: ${negative_keywords}`;
    fullPrompt = fullPrompt.trim();

    const token = await this.userTokenRepository.findOne({ where: { user: { id } } });
    if (!token) {
      throw new BadRequestException('Please buy tokens to use this service.');
    }
    if (token.remainingTokens === 0) {
      throw new BadRequestException('Your token balance is 0. Please recharge.');
    }
    const usedToken = await this.calculateUsedToken.getTokenCost(imageSize);
    // console.log("*****************")
    // console.log(usedToken);

    const remainingToken = await this.usertokenService.deductTokens(id, usedToken);

    try {
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: fullPrompt,
        n: 1,
        size: imageSize,
      });

      const imageUrl = response.data[0].url;
      const savedImage = await this.uploadService.upload(imageUrl);

      if (savedImage && id) {

        const newImage = this.imageRepository.create({
          image: savedImage,
          prompt: title,
          user: { id } as userEntity,
        });

        const saved = await this.imageRepository.save(newImage);

        return {
          id: saved.id,
          image: saved.image,
          success: true,
          remainingToken,
        };
      }

      throw new BadRequestException('Image could not be saved.');
    } catch (error) {
      console.error('Image generation error:', error);
      if (error?.response?.status === 400) {
        throw new BadRequestException('Your request was blocked by the safety system. Please revise your prompt.');
      }
      throw new BadRequestException('Image generation failed. Please try again later.');
    }
  }


  async findAll(id: string) {
    try {
      const images = await this.imageRepository.find({ where: { user: { id } }, select: { id: true, createdAt: true, image: true, prompt: true, status: true } });
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
      const image = await this.imageRepository.findOne({ where: { id, user: { id: userId } } });
      if (!image) {
        throw new NotFoundException("Image not found");
      }

      const currentStatus = image.status;
      image.status = !currentStatus;
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




  async remove(id: string) {
    const image = await this.imageRepository.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException("Image not found");
    }
    return await this.imageRepository.remove(image);
  }
}
