import { Body, Controller, Headers, Post } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('place')
  async placeOrder(
    @Headers('x-user-id') userId: string,
    @Body() body: any,
  ) {
    return this.orderService.placeOrder(
      userId,
      body.address,
      body.phone,
      body.city,
    );
  }
}
