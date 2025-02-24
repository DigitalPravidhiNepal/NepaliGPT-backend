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


@Module({
  imports: [TypeOrmModule.forFeature([userEntity, templateEntity, ttsEntity, sttEntity, imageEntity, codeEntity])],
  controllers: [UserController],
  providers: [UserService, UploadService],
})
export class UserModule { }
