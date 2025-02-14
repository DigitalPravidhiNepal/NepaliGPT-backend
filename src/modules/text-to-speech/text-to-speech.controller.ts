import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TextToSpeechService } from './text-to-speech.service';
import { CreateTextToSpeechDto } from './dto/create-text-to-speech.dto';
import { UpdateTextToSpeechDto } from './dto/update-text-to-speech.dto';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { ApiBasicAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('text-to-speech')
@ApiTags('Text to Speech')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class TextToSpeechController {
  constructor(private readonly textToSpeechService: TextToSpeechService) { }

  @Post()
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBasicAuth("access-token")
  create(@Body() createTextToSpeechDto: CreateTextToSpeechDto, @Req() req: any) {
    const id = req.user.sub;
    return this.textToSpeechService.generateSpeech(createTextToSpeechDto, id);
  }

  @Get()
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBasicAuth("access-token")
  findAll(@Req() req: any) {
    const id = req.user.sub;
    return this.textToSpeechService.findAll(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.textToSpeechService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTextToSpeechDto: UpdateTextToSpeechDto) {
  //   return this.textToSpeechService.update(+id, updateTextToSpeechDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.textToSpeechService.remove(+id);
  // }
}
