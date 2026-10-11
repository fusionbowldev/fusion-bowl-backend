import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts(@Query('city') city: string) {
    return this.productService.getProducts(city);
  }

  @Post()
  createProduct(@Body() body: any) {
    return this.productService.createProduct(body);
  }
}
