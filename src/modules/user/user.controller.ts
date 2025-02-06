import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, FileTypeValidator, ParseFilePipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { PhotoUpdateDto } from './dto/update-photo.dto';
import { UploadService } from 'src/helper/utils/files_upload';

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

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('edit-info')
  @Roles(roleType.customer, roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  update(@Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    const { id } = req.user;
    return this.userService.update(id, updateUserDto);
  }

  // @Patch('update-photo')
  // @Roles(roleType.customer)
  // @UseGuards(AtGuard, RolesGuard)
  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'update photo' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({ type: PhotoUpdateDto })
  // @UseInterceptors(FileInterceptor('photo'))
  // async updatePhoto(
  //   @Req() req: any,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         // new MaxFileSizeValidator({ maxSize: 1000 }),
  //         new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg|webp)/ }),
  //       ],
  //     }),
  //   )
  //   file?: Express.Multer.File,
  // ) {

  //   const s3response = await this.uploadService.upload(file)
  //   const id = req.user.sub;

  //   return this.userService.updatePhoto(id, s3response);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
