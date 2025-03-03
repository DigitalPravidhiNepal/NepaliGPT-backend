import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { CodeService } from './code.service';
import { CreateCodeDto } from './dto/create-code.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('code')
@UseInterceptors(CacheInterceptor)
@ApiTags('Code')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class CodeController {
  constructor(private readonly codeService: CodeService) { }

  @Post()
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'generate AI codes' })
  create(@Body() createCodeDto: CreateCodeDto, @Req() req: any) {
    const id = req.user.sub;
    return this.codeService.generateCode(createCodeDto, id);
  }

  @Get()
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all codes' })
  findAll(@Req() req: any) {
    const id = req.user.sub;
    return this.codeService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.codeService.findOne(id);
  }


  @Patch('save/:id')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'save codes' })
  update(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.codeService.updateStatus(id, userId);
  }

  @Patch('unsave/:id')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'unsave codes' })
  unsave(@Param('id') id: string) {
    return this.codeService.unsave(id);
  }



  @Delete(':id')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete codes' })
  remove(@Param('id') id: string) {
    return this.codeService.remove(id);
  }
}
