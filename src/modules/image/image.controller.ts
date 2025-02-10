import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ImageService } from './image.service';

import { GenerateImageDto } from './dto/create-image.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';


@Controller('image')
@ApiTags('Image')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class ImageController {
  constructor(private readonly imageService: ImageService) { }


  @Post('generate-image')
  @Roles(roleType.superAdmin, roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'generate images' })
  async generateImage(@Body() generateImageDto: GenerateImageDto, @Req() req: any) {
    const { sub, role } = req.user;
    if (role === roleType.customer) {
      return this.imageService.generateImage(generateImageDto, sub);
    } else {
      return this.imageService.generateImage(generateImageDto);
    }

  }

  @Get('get-images')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all images' })
  findAll(@Req() req: any) {
    const id = req.user.id;
    return this.imageService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
  //   return this.imageService.update(+id, updateImageDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
