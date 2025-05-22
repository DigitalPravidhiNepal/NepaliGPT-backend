import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from 'src/model/user.entity';
import { paymentEntity } from 'src/model/payment.entity';
import { UsertokenService } from '../usertoken/usertoken.service';
import { userTokenEntity } from 'src/model/userToken.entity';
import { PricingEntity } from 'src/model/pricing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([userEntity, paymentEntity, userTokenEntity, PricingEntity])],
  controllers: [PaymentController],
  providers: [PaymentService, UsertokenService],
})
export class PaymentModule { }
