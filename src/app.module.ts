import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/pg.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { ImageModule } from './modules/image/image.module';
import { ChatModule } from './modules/chat/chat.module';
import { CodeModule } from './modules/code/code.module';
import { SpeechToTextModule } from './modules/speech-to-text/speech-to-text.module';
import { TextToSpeechModule } from './modules/text-to-speech/text-to-speech.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { UsertokenModule } from './modules/usertoken/usertoken.module';
import { PaymentModule } from './modules/payment/payment.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { authEntity } from './model/auth.entity';
import { superAdminEntity } from './model/superAdmin.entity';
import { SuperAdminSeederService } from './seed/seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([authEntity, superAdminEntity]),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      ttl: 50 * 1000, // Cache expiration time
    }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    UserModule,
    SuperAdminModule,
    ImageModule,
    ChatModule,
    CodeModule,
    SpeechToTextModule,
    TextToSpeechModule,
    TemplatesModule,
    UsertokenModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [
    SuperAdminSeederService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
