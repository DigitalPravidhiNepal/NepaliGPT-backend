import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { userEntity } from 'src/model/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(userEntity)
    private readonly userRepository: Repository<userEntity>
  ) { }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
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

  async updatePhoto(id: string, photo: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    user.photo = photo;
    await this.userRepository.save(user);
    return true
  }


  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
