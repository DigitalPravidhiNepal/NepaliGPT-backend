import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';

@Controller('payment')
@ApiTags('Payment')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }
  @Post('initiate')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  // async initiatePayment(
  //   @Body() createPaymentDto: CreatePaymentDto, @Req() req: any
  // ) {
  //   const userId = req.user.id;

  //   try {
  //     const paymentUrl = await this.paymentService.initiatePayment(createPaymentDto, userId,);
  //     return {
  //       status: HttpStatus.OK,
  //       url: paymentUrl
  //     }
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   };
  // }

  @Patch('change-payment/:token')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  changePayment(@Req() req: any, @Param('token') token: string) {
    const userId = req.user.id;
    return this.paymentService.changePayment(userId, token);
  }

}
