import { Controller, Post, Body, Headers } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@Body() body: any, @Headers('x-user-id') userId: string) {
    return this.cartService.add(userId, body.productId, body.quantity);
  }
}
