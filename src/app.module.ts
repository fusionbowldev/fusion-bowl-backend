import { Module } from '@nestjs/common';
import { AdminController } from './modules/admin/admin.controller';
import { AdminService } from './modules/admin/admin.service';
import { CartController } from './modules/cart/cart.controller';
import { CartService } from './modules/cart/cart.service';
import { InventoryController } from './modules/inventory/inventory.controller';
import { InventoryService } from './modules/inventory/inventory.service';
import { OrderController } from './modules/order/order.controller';
import { OrderService } from './modules/order/order.service';
import { ProductController } from './modules/product/product.controller';
import { ProductService } from './modules/product/product.service';
import { PrismaService } from './prisma/prisma.service';
import { HealthController } from './health.controller';

@Module({
  imports: [],
  controllers: [
    HealthController,
    AdminController,
    CartController,
    InventoryController,
    OrderController,
    ProductController,
  ],
  providers: [
    AdminService,
    CartService,
    InventoryService,
    OrderService,
    ProductService,
    PrismaService,
  ],
})
export class AppModule {}
