import { Module } from '@nestjs/common';
import { UsertokenService } from './usertoken.service';
import { UsertokenController } from './usertoken.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userTokenEntity } from 'src/model/userToken.entity';
import { ConfigService } from '@nestjs/config';
import { Calculate } from 'src/helper/utils/getTotalCost';
import { PricingEntity } from 'src/model/pricing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([userTokenEntity, PricingEntity])],
  controllers: [UsertokenController],
  providers: [UsertokenService, ConfigService]
})
export class UsertokenModule { }
