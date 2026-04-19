import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Create Sub Admin
  async createSubAdmin(body: any) {
    return this.prisma.admin.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password, // hash later
        role: 'SUB_ADMIN',
      },
    });
  }

  // Create Product
  async createProduct(body: any) {
    return this.prisma.product.create({
      data: {
        name: body.name,
        category: body.category,
        price: body.price,
        imageUrl: body.imageUrl,
        benefits: body.benefits,
        storageTips: body.storageTips,
        consumptionTips: body.consumptionTips,
        tags: body.tags,
      },
    });
  }

  // Update Product
  async updateProduct(id: string, body: any) {
    return this.prisma.product.update({
      where: { id },
      data: body,
    });
  }

  // Update Inventory (weekly stock)
  async updateInventory(body: any) {
    return this.prisma.inventory.upsert({
      where: {
        id: body.id || '',
      },
    update: {
      availableQuantity: {
        increment: body.availableQuantity, 
      },
    },
      create: {
        productId: body.productId,
        availableQuantity: body.availableQuantity,
        weekStartDate: new Date(),
      },
    });
  }

  // Get Orders (with items)
  async getOrders() {
    return this.prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Update Order Status
  async updateOrderStatus(orderId: string, status: any) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status,
      },
    });
  }
}