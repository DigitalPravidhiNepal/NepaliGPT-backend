import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, FileTypeValidator, ParseFilePipe, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserByAdminDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { DocumentName, roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { PhotoUpdateDto, UpdatePasswordDto } from './dto/update-photo.dto';
import { UploadService } from 'src/helper/utils/files_upload';
import { FileInterceptor } from '@nestjs/platform-express'
import { UpdateAuthDto } from '../auth/dto/update-auth.dto';

@Controller('user')
@ApiTags('User')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('all')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  findAll() {
    return this.userService.findAll();
  }

  @Get('saved')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  findAllSaved(@Req() req: any, @Query('document') document: DocumentName) {
    const id = req.user.sub;
    return this.userService.savedDocuments(id, document);
  }

  @Get('get-info')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  findOne(@Req() req: any) {
    const id = req.user.sub;
    return this.userService.findOne(id);
  }

  @Get('get-info-by-id/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  findOneById(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('get-credit')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  getCredit(@Req() req: any) {
    const id = req.user.sub;
    return this.userService.getCredit(id);
  }


  @Patch('add-info')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'add phone and country after google oauth' })
  addInfo(@Body() updateUserDto: UpdateAuthDto, @Req() req: any) {
    const { id } = req.user;
    return this.userService.addInfo(updateUserDto, id);
  }

  @Patch('edit-info')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'edit user info by user' })
  update(@Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    const { id } = req.user;
    return this.userService.update(id, updateUserDto);
  }

  @Patch('edit-info-by-superadmin/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'edit user info by superadmin' })
  updateBySuperAdmin(@Body() updateUserDto: UpdateUserByAdminDto, @Param('id') id: string) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('changePassword')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'change password by user' })
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Req() req: any) {
    const id = req.user.sub;
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Patch('update-photo')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: PhotoUpdateDto })
  @UseInterceptors(FileInterceptor('photo'))
  async updatePhoto(
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg|webp)/ }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {

    const s3response = await this.uploadService.upload(file)
    const id = req.user.sub;

    return this.userService.updatePhoto(id, s3response);
  }

  @Patch('edit-info/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'edit user info by superAdmin' })
  updateInfo(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    return this.userService.updateInfo(id, updateUserDto);
  }


  @Delete(':id')
  @Patch('update-photo')
  @ApiOperation({ summary: 'delete user' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
