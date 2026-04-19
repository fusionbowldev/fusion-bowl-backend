import { Controller, Post, Body, Get, Put, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ✅ Create sub-admin
  @Post('create-sub-admin')
  createSubAdmin(@Body() body: any) {
    return this.adminService.createSubAdmin(body);
  }

  // ✅ Add product
  @Post('product')
  createProduct(@Body() body: any) {
    return this.adminService.createProduct(body);
  }

  // ✅ Update product
  @Put('product/:id')
  updateProduct(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateProduct(id, body);
  }

  // ✅ Update inventory
  @Put('inventory')
  updateInventory(@Body() body: any) {
    return this.adminService.updateInventory(body);
  }

  // ✅ Get all orders
  @Get('orders')
  getOrders() {
    return this.adminService.getOrders();
  }

  // ✅ Update order status
  @Put('order/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateOrderStatus(id, body.status);
  }
}