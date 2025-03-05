import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from 'src/model/user.entity';
import { paymentEntity } from 'src/model/payment.entity';
import { JwtService } from '@nestjs/jwt';
import { UsertokenService } from '../usertoken/usertoken.service';

@Module({
  imports: [TypeOrmModule.forFeature([userEntity, paymentEntity])],
  controllers: [PaymentController],
  providers: [PaymentService, JwtService, UsertokenService],
})
export class PaymentModule { }
