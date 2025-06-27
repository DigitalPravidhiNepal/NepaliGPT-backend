import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateSavedTemplateContentDto, CreateTemplateCategoryDto, CreateTemplateDto, generateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import OpenAI from 'openai';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
// import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('templates')
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

  @Post('create-template-category')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ description: 'create template category by superadmin' })
  createTemplateCategory(@Body() createTemplateCategoryDto: CreateTemplateCategoryDto) {
    return this.templatesService.createTemplateCategory(createTemplateCategoryDto);
  }

  @Get('template-category')
  @ApiOperation({ summary: "get all template category" })
  findAllTemplateCategory() {
    return this.templatesService.findAllTemplateCategory();
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
  @UseGuards(AtGuard, RolesGuard)
  findAll(
    @Query('categoryId') categoryId: string,
    @Req() req: any
  ) {
    const userId = req.user.sub;
    return this.templatesService.findAll(categoryId, userId);
  }

  @Get('category')
  @ApiOperation({ summary: "get all category" })
  findAllCategory() {
    return this.templatesService.findAllCategory();
  }

  @Get('popular')
  @ApiOperation({ summary: "get popular templates" })
  findPopular() {
    return this.templatesService.getPopular();
  }


  @Get('my-saved-templates-content')
  @ApiOperation({ summary: "get all saved templates content" })
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(roleType.customer)
  findAllSavedContent(
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.templatesService.findAllSavedContent(userId);
  }

  @Get('is-my-favorite/:id')
  @ApiOperation({ summary: "check if template is favorite" })
  isFavorite(
    @Req() req: any,
    @Param('id') templateId: string
  ) {
    const userId = req.user.sub;
    return this.templatesService.isMyFavorite(templateId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: "get a template" })
  findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  @Post('toggle-favorite/:id')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "mark template as favorite" })
  markAsFavorite(@Req() req: any, @Param('id') templateId: string,) {
    const userId = req.user.sub;
    return this.templatesService.toggleFavorite(templateId, userId);
  }

  @Patch(':id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "update template" })
  updateTemplate(@Body() bodydto: UpdateTemplateDto, @Param('id') id: string) {
    return this.templatesService.update(id, bodydto);
  }

  @Patch('save/:id')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "save template content" })
  update(@Body() Body: CreateSavedTemplateContentDto, @Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.templatesService.updateStatus(id, userId, Body);
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
