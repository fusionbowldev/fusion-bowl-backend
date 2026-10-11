import { Controller, Get, Post, Body, Headers, Param, Query } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@Body() body: any) {
    return this.cartService.add(
      body.userId,
      body.productId,
      body.quantity,
      body.city,
    );
  }

  @Get(':userId')
  getCart(
    @Param('userId') userId: string,
    @Query('city') city: string,
  ) {
    return this.cartService.getCart(userId,city);
  }
}
