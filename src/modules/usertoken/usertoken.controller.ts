import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsertokenService } from './usertoken.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { createTokenDto } from './dto/create-token.entity';


@Controller('usertoken')
@ApiTags('User-token')
export class UsertokenController {
  constructor(private readonly usertokenService: UsertokenService,
  ) { }
  @Post('addToken')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  addToken(@Req() req: any, @Body() CreateTokenDto: createTokenDto) {
    const id = req.user.sub;
    const { amount } = CreateTokenDto;
    return this.usertokenService.addTokens(id, amount)
  }

  @Get('user-credit')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  getCredit(@Req() req: any) {
    const id = req.user.sub;
    return this.usertokenService.getUserTokens(id);
  }


}
