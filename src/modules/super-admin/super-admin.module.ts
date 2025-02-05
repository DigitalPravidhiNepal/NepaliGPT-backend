import { Module } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminController } from './super-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authEntity } from 'src/model/auth.entity';
import { packageEntity } from 'src/model/package.entity';
import { DataSource } from 'typeorm';
import { hash } from 'src/helper/utils/hash';

@Module({
  imports: [TypeOrmModule.forFeature([authEntity, packageEntity])],
  controllers: [SuperAdminController],
  providers: [SuperAdminService, hash],
})
export class SuperAdminModule { }
