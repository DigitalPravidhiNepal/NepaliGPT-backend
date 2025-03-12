import { BadRequestException, Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { userEntity } from 'src/model/user.entity';
import { Repository } from 'typeorm';
import { TransformationType } from 'class-transformer';
import { codeEntity } from 'src/model/code.entity';
import { imageEntity } from 'src/model/image.entity';
import { sttEntity } from 'src/model/stt.entity';
import { templateEntity } from 'src/model/templates.entity';
import { ttsEntity } from 'src/model/tts.entity';
import { DocumentName } from 'src/helper/types/index.type';
import { authEntity } from 'src/model/auth.entity';
import { contentEntity } from 'src/model/content.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { UpdateAuthDto } from '../auth/dto/update-auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(userEntity)
    private readonly userRepository: Repository<userEntity>,
    @InjectRepository(contentEntity)
    private readonly contentRepo: Repository<contentEntity>,
    @InjectRepository(imageEntity)
    private imageRepository: Repository<imageEntity>,
    @InjectRepository(codeEntity)
    private codeRepository: Repository<codeEntity>,

    @InjectRepository(sttEntity)
    private readonly sttRepository: Repository<sttEntity>,
    @InjectRepository(ttsEntity)
    private readonly ttsRepository: Repository<ttsEntity>
  ) { }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async addInfo(AddinfoDto: UpdateAuthDto, id: string) {
    const { phone, country } = AddinfoDto;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    user.phone = phone;
    user.country = country;
    await this.userRepository.save(user);
    return {
      status: true
    }
  }

  async findAll() {
    try {
      const user = await this.userRepository.find();
      return user;
    } catch (e) {
      throw new BadRequestException("No users ");
    }
  }


  async savedDocuments(id: string, documentName: DocumentName) {
    try {
      switch (documentName) {
        case DocumentName.Template:
          return await this.contentRepo.find({ where: { status: true, user: { id } } });
        case DocumentName.Image:
          return await this.imageRepository.find({ where: { status: true, user: { id } } });
        case DocumentName.Code:
          return await this.codeRepository.find({ where: { status: true, user: { id } } });
        case DocumentName.SpeechToText:
          return await this.sttRepository.find({ where: { status: true, user: { id } } });
        case DocumentName.TextToSpeech:
          return await this.ttsRepository.find({ where: { status: true, user: { id } } });
        default:
          return new NotFoundException("Invalid document");
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id }, relations: ['auth', 'tokens'],
        select: {
          id: true,
          auth: { email: true },
          name: true, phone: true, photo: true, country: true, isActive: true, tokens: {
            remainingTokens: true, usedTokens: true, totalTokens: true
          }
        }
      });
      return user;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new BadRequestException("User doesn't exist");
      }
      const updateUser = Object.assign(user, updateUserDto);
      return await this.userRepository.save(updateUser);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async updateInfo(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new BadRequestException("User doesn't exist");
      }
      const updateUser = Object.assign(user, updateUserDto);
      return await this.userRepository.save(updateUser);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async updatePhoto(id: string, photo: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      user.photo = photo;
      await this.userRepository.save(user);
      return true
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }


  async remove(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      return await this.userRepository.remove(user);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
