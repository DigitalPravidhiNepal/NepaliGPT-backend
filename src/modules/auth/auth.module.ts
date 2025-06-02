import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Token } from 'src/helper/utils/token';
import { hash } from 'src/helper/utils/hash';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authEntity } from 'src/model/auth.entity';
import { AtStrategy } from 'src/middlewares/access_token/at.strategy';
import { RtStrategy } from 'src/middlewares/refresh_token/rt.strategy';
import { JwtService } from '@nestjs/jwt';
import { UtStrategy } from 'src/middlewares/utils_token/ut.strategy';
import { ConfigService } from '@nestjs/config';
import { userEntity } from 'src/model/user.entity';
import { GoogleStrategy } from 'src/middlewares/Google Oauth/google.strategy';
import { PricingEntity } from 'src/model/pricing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([authEntity, userEntity, PricingEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, Token, hash, AtStrategy, RtStrategy, UtStrategy, JwtService, ConfigService, GoogleStrategy],
})
export class AuthModule { }
