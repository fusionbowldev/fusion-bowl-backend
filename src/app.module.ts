import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CartModule } from './modules/cart/cart.module';

import { HealthModule } from './modules/health/health.module';
import { OrderModule } from './modules/order/order.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    HealthModule,
    ProductModule,
    InventoryModule,
    CartModule,
    OrderModule,
    AdminModule
  ],
})
export class AppModule {}
