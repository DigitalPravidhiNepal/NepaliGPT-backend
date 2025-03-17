import { Module } from '@nestjs/common';
import { UsertokenService } from './usertoken.service';
import { UsertokenController } from './usertoken.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userTokenEntity } from 'src/model/userToken.entity';
import { ConfigService } from '@nestjs/config';
import { Calculate } from 'src/helper/utils/getTotalCost';

@Module({
  imports: [TypeOrmModule.forFeature([userTokenEntity])],
  controllers: [UsertokenController],
  providers: [UsertokenService, ConfigService]
})
export class UsertokenModule { }
