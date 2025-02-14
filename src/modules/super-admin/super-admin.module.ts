import { Module } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminController } from './super-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authEntity } from 'src/model/auth.entity';
import { packageEntity } from 'src/model/package.entity';
import { hash } from 'src/helper/utils/hash';
import { botEntity } from 'src/model/bot.entity';
import { UploadService } from 'src/helper/utils/files_upload';
import { ConvertAudio } from 'src/helper/utils/conversion';

@Module({
  imports: [TypeOrmModule.forFeature([authEntity, packageEntity, botEntity])],
  controllers: [SuperAdminController],
  providers: [SuperAdminService, hash, UploadService],
})
export class SuperAdminModule { }
