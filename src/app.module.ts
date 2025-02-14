import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/pg.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ImageModule } from './modules/image/image.module';
import { ChatModule } from './modules/chat/chat.module';
import { CodeModule } from './modules/code/code.module';
import { SpeechToTextModule } from './modules/speech-to-text/speech-to-text.module';
import { TextToSpeechModule } from './modules/text-to-speech/text-to-speech.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    UserModule,
    SuperAdminModule,
    PaymentModule,
    ImageModule,
    ChatModule,
    CodeModule,
    SpeechToTextModule,
    TextToSpeechModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }