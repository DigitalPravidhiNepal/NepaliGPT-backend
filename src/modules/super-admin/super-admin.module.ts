import { Module } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminController } from './super-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authEntity } from 'src/model/auth.entity';
import { hash } from 'src/helper/utils/hash';

import { UploadService } from 'src/helper/utils/files_upload';
import { ConvertAudio } from 'src/helper/utils/conversion';
import { PricingEntity } from 'src/model/pricing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([authEntity, PricingEntity])],
  controllers: [SuperAdminController],
  providers: [SuperAdminService, hash, UploadService],
})
export class SuperAdminModule { }
