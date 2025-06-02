import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, Query, FileTypeValidator, ParseFilePipe, UploadedFile, UseInterceptors, Put } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionType, roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { UUID } from 'crypto';
import { CreateBotDto, CreateSuperAdminDto, UpdateBotDto, UpdatePhotoDto } from './dto/create-super-admin.dto';
import { CreatePackageDto, UpdatePackageDto } from './dto/package.dto';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/helper/utils/files_upload';
import { UpdatePriceDto } from '../usertoken/dto/create-token.entity';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { PricingEntity } from 'src/model/pricing.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('super-admin')
@ApiTags('Super Admin')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService,
    private readonly uploadService: UploadService,

    @InjectRepository(PricingEntity)
    private pricingRepository: Repository<PricingEntity>,

    private configService: ConfigService
  ) { }

  // Add Super Admin
  @Post('account')
  @ApiOperation({ summary: 'Create a superAdmin Account' })
  createSuperAdmin(@Body() createAuthDto: CreateSuperAdminDto) {
    return this.superAdminService.createSuperAdmin(createAuthDto);
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

  @Get('get-prices')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get-prices' })
  getprices() {
    return this.superAdminService.getPrice();
  }

  @Patch('update-prices')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update price' })
  async updatePrices(@Body() updatePriceDto: UpdatePriceDto) {
    const { exchangeRate, totalTokenCost } = updatePriceDto;
    const isPricingSet = await this.pricingRepository.find();
    if (isPricingSet.length === 0) {
      const resp = await this.pricingRepository.save({ exchangeRate, totalTokenCost });
      return {
        message: 'Prices updated successfully',
        data: resp
      };
    } else {
      const pricing = isPricingSet[0];
      pricing.exchangeRate = exchangeRate;
      pricing.totalTokenCost = totalTokenCost;
      const resp = await this.pricingRepository.save(pricing);
      return {
        message: 'Prices updated successfully',
        data: resp
      };
    }

    // const { exchangeRate, totalTokenCost } = updatePriceDto;
    // await this.configService.set('EXCHANGE_RATE', exchangeRate);
    // await this.configService.set('TOTALTOKENCOST', totalTokenCost);

    // return {
    //   message: 'Prices updated successfully',
    //   data: {
    //     exchangeRate: this.configService.get('EXCHANGE_RATE'),
    //     totalTokenCost: this.configService.get('TOTALTOKENCOST')
    //   }
    // };
  }

} 