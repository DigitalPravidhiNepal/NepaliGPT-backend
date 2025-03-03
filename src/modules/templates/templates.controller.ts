import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto, generateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import OpenAI from 'openai';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('templates')
@UseInterceptors(CacheInterceptor)
@ApiTags('Templates')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService,
    private readonly openai: OpenAI
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  @Post()
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ description: 'create template by superadmin' })
  create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templatesService.create(createTemplateDto);
  }

  @Post('generate/:id')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'generate content from template' })
  generate(@Req() req: any, @Param('id') id: string, @Body() dto: generateDto) {
    const userId = req.user.sub;
    return this.templatesService.generate(id, dto, userId);
  }

  @Get()
  @ApiOperation({ summary: "get all templates" })
  findAll() {
    return this.templatesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "get a template" })
  findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  @Patch('save/:id')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "save template content" })
  update(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.templatesService.updateStatus(id, userId);
  }

  @Patch('unsave/:id')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "unsave template content" })
  unsave(@Param('id') id: string) {
    return this.templatesService.unsave(id);
  }

  @Delete(':id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "delete template" })
  remove(@Param('id') id: string) {
    return this.templatesService.remove(id);
  }
}
