import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, FileTypeValidator, ParseFilePipe, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { SpeechToTextService } from './speech-to-text.service';
import { CreateSpeechToTextDto } from './dto/create-speech-to-text.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { UploadSoundService } from 'src/helper/utils/uploadSound';

@Controller('speech-to-text')
@ApiTags('Speech to Text')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class SpeechToTextController {
  constructor(private readonly speechToTextService: SpeechToTextService,
    private readonly uploadService: UploadSoundService
  ) { }

  // @Post()
  // create(@Body() createSpeechToTextDto: CreateSpeechToTextDto) {
  //   return this.speechToTextService.create(createSpeechToTextDto);
  // }
  @Post()
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update audio file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSpeechToTextDto })
  @UseInterceptors(FileInterceptor('audio'))
  async updateAudio(
    @Body() createSpeechToTextDto: CreateSpeechToTextDto,
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /audio\/(mp3|wav|mpeg)/ }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No audio file uploaded');
    }
    const s3response = await this.uploadService.upload(file); // Upload audio to S3 or storage
    const id = req.user.sub;
    createSpeechToTextDto.audio = s3response;
    return this.speechToTextService.transcribeAudio(id, createSpeechToTextDto); // Update user audio record
  }

  @Get()
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all transcriptions' })
  findAll(@Req() req: any) {
    const id = req.user.sub;
    return this.speechToTextService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.speechToTextService.findOne(id);
  }


  @Patch('save/:id')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'save transcriptions' })
  update(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.speechToTextService.updateStatus(id, userId);
  }

  @Patch('unsave/:id')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'unsave transcriptions' })
  unsave(@Param('id') id: string) {
    return this.speechToTextService.unsave(id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.speechToTextService.remove(+id);
  // }
}
