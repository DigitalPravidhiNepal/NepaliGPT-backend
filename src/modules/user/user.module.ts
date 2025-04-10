import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from 'src/model/user.entity';
import { UploadService } from 'src/helper/utils/files_upload';
import { templateEntity } from 'src/model/templates.entity';
import { ttsEntity } from 'src/model/tts.entity';
import { sttEntity } from 'src/model/stt.entity';
import { imageEntity } from 'src/model/image.entity';
import { codeEntity } from 'src/model/code.entity';
import { contentEntity } from 'src/model/content.entity';
import { authEntity } from 'src/model/auth.entity';
import { hash } from 'src/helper/utils/hash';


@Module({
  imports: [TypeOrmModule.forFeature([userEntity, authEntity, contentEntity, ttsEntity, sttEntity, imageEntity, codeEntity])],
  controllers: [UserController],
  providers: [UserService, UploadService, hash],
})
export class UserModule { }
