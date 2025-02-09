import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { userEntity } from 'src/model/user.entity';
import { Repository } from 'typeorm';
import { TransformationType } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(userEntity)
    private readonly userRepository: Repository<userEntity>
  ) { }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    try {
      const user = await this.userRepository.find();
      return user;
    } catch (e) {
      throw new BadRequestException("No users ");
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      return user;
    } catch (e) {
      throw new BadRequestException("user doesn't exist");
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
