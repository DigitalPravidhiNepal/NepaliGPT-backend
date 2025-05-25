import { BadRequestException, Body, Controller, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { CreatePaymentDto } from './dto/createpayment.dto';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }
  @Post('initiate')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Booking successful',
    schema: {
      example: {
        success: true,
        message: 'Booking confirmed',
        data: {
          bookingId: '12345',
          room: 'Deluxe Room',
          checkIn: '2025-05-25',
          checkOut: '2025-05-28'
        }
      }
    }
  })
  async initiatePayment(
    @Body() createPaymentDto: CreatePaymentDto, @Req() req: any
  ) {
    const { amount } = createPaymentDto;
    const userId = req.user.sub;

    try {
      const paymentUrl = await this.paymentService.initiatePayment(amount, userId);
      return {
        status: HttpStatus.OK,
        url: paymentUrl
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    };
  }

  @Patch('change-payment/:token')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  changePayment(@Req() req: any, @Param('token') token: string) {
    const userId = req.user.sub;
    return this.paymentService.changePayment(userId, token);
  }
}
