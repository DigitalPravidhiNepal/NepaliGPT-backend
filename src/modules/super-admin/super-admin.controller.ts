import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, Query, FileTypeValidator, ParseFilePipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionType, roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { packageEntity } from 'src/model/package.entity';
import { UUID } from 'crypto';
import { CreateBotDto, CreateSuperAdminDto, UpdateBotDto, UpdatePhotoDto } from './dto/create-super-admin.dto';
import { CreatePackageDto, UpdatePackageDto } from './dto/package.dto';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/helper/utils/files_upload';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('super-admin')
@UseInterceptors(CacheInterceptor)
@ApiTags('Super Admin')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService,
    private readonly uploadService: UploadService
  ) { }

  // Add Super Admin
  @Post('account')
  @ApiOperation({ summary: 'Create a superAdmin Account' })
  createSuperAdmin(@Body() createAuthDto: CreateSuperAdminDto) {
    return this.superAdminService.createSuperAdmin(createAuthDto);
  }

  @Post('create-bot')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBasicAuth('access-token')
  @ApiOperation({ summary: 'Create a bot' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  async createBot(@Body() createBotDto: CreateBotDto, @UploadedFile(
    new ParseFilePipe({
      fileIsRequired: false,
      validators: [
        // new MaxFileSizeValidator({ maxSize: 1000 }),
        new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg|webp)/ }),
      ],
    }),
  )
  file?: Express.Multer.File) {

    const s3response = createBotDto.photo ? createBotDto.photo : await this.uploadService.upload(file);
    return this.superAdminService.createBot(createBotDto, s3response);
  }


  // Update pacakge
  @Patch('update-botInfo/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update bot info' })
  async updateBot(
    @Param('id') id: string,
    @Body() updateBotDTO: UpdateBotDto,
  ) {
    return this.superAdminService.updateBot(id, updateBotDTO);
  }

  // Update bot image
  @Patch('update-photo/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update avatar of bot' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  async updateAvatar(
    @Param('id') id: string,
    @Body() updatePhotoDto: UpdatePhotoDto, @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg|webp)/ }),
        ],
      }),
    )
    file?: Express.Multer.File) {
    const s3response = updatePhotoDto.photo ? updatePhotoDto.photo : await this.uploadService.upload(file);
    return this.superAdminService.updateAvatar(id, s3response);
  }

  //delete Bot

  @Delete('delete-bot/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete bot' })
  deleteBot(@Param('id') id: string) {
    return this.superAdminService.deleteBot(id);
  }
  // // Delete Super Admin
  // @Delete('delete-super-admin/:id')
  // @Roles(roleType.superAdmin)
  // @UseGuards(AtGuard, RolesGuard)
  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'delete superAdmin account' })
  // deleteSuperAdmin(@Param('id', ParseUUIDPipe) id: UUID) {
  //   return this.superAdminService.deleteSuperAdmin(id);
  // }

  @Get('all-user')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all user accounts' })
  findAllUser(@Query() paginationDto?: PaginationDto) {
    return this.superAdminService.findAllUser(paginationDto);
  }


  // Create a new package
  @Post('create-package')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create packakge' })
  async createPackage(@Body() createPackageDto: CreatePackageDto) {
    return this.superAdminService.createPackage(createPackageDto);
  }

  // Get all pacakges
  @Get('get-packages')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all pacakges' })
  async findAll(): Promise<packageEntity[]> {
    return this.superAdminService.findAllPackage();
  }

  // Update pacakge
  @Patch('update-packages/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update pacakge' })
  async update(
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return this.superAdminService.updatePackage(id, updatePackageDto);
  }

  // Delete pacakge
  @Delete('delete-packages/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete pacakge' })
  async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<packageEntity> {
    return this.superAdminService.deletePackage(id);
  }
} 