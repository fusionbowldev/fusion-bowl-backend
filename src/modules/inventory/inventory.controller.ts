import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  getInventoryForProducts(@Query('city') city: string) {
    return this.inventoryService.getInventoryForProducts(city);
  }

  @Get(':productId')
  getInventory(
    @Param('productId') productId: string,
    @Query('city') city: string,
  ) {
    return this.inventoryService.getInventory(productId, city);
  }

  @Post('update')
  updateInventory(@Body() body: any) {
    return this.inventoryService.updateInventory(body);
  }
}
