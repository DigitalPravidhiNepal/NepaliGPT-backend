import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, MailDto, passwordDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RtGuard } from 'src/middlewares/refresh_token/rt.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { UtGuard } from 'src/middlewares/utils_token/ut.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('Auth')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signin')
  @ApiOperation({ summary: 'SignIn your user Account' })
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto)
  }

  @Post('signin-superAdmin')
  @ApiOperation({ summary: 'SignIn your superAdmin Account' })
  loginSuperAdmin(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.loginAdmin(createAuthDto)
  }


  //get email for verification
  @Post('get-verify')
  getVerify(@Body() email: MailDto) {
    return this.authService.getVerify(email);
  }

  //regiter account
  @Post('register')
  @UseGuards(UtGuard)
  @ApiBearerAuth('access-token')
  create(@Body() createuserdto: CreateUserDto, @Req() req: any) {
    const jwtPayload = req.user;
    return this.authService.create(createuserdto, jwtPayload);
  }

  @Get('google')
  @ApiOperation({ summary: 'redirect to Google for authentication' })
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // This will redirect to Google for authentication
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'get user details from Google' })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const auth = req.user;
    return this.authService.GoogleOauth(auth);
  }
  // @Post('staff-signin')
  // @ApiOperation({ summary: 'SignIn your Account' })
  // loginStaff(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.loginStaff(createAuthDto)
  // }

  @Post('refresh-token')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Generate access token" })
  @UseGuards(RtGuard)
  async refrshToken(@Req() req) {
    const { user } = req
    return this.authService.refreshTokenAdmin(user);
  }

  // @Get('user-info')
  // @UseGuards(AtGuard)
  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'User Info' })
  // userInfo(@Req() req: any) {
  //   const user = req.user;
  //   return this.authService.getCombinedUserInfo(user);
  // }

  @Post('forget-password')
  async forgetPassword(@Body() body: MailDto) {
    return this.authService.forgetPasswordAdmin(body);
  }

  // @Patch('update-password')
  // @Roles(roleType.admin, roleType.staff)
  // @UseGuards(AtGuard, RolesGuard)
  // @ApiBearerAuth('access-token')
  // updatePassword(@Req() req: any, @Body() passwordDto: passwordDto) {
  //   console.log(req.user);
  //   // const userId=req.user;
  //   return this.authService.updatePassword(req.user, passwordDto);
  // }

  @Patch('reset-password')
  @UseGuards(UtGuard)
  @ApiBearerAuth('access-token')
  resetPassword(@Req() req: any, @Body() passwordDto: passwordDto) {
    const userId = req.user.sub;
    return this.authService.resetPassword(userId, passwordDto);
  }
}
