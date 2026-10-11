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
        isPerishable: body.isPerishable,
        // price: body.price,
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
    const city = body.city ?? 'narasaraopet';
    const weekStartDate = body.weekStartDate ?? new Date();

    return this.prisma.inventory.upsert({
      where: {
        productId_city: {
          productId: body.productId,
          city,
        },
      },
      update: {
        availableQuantity: {
          increment: body.availableQuantity,
        },
        updatedAt: new Date(),
      },
      create: {
        productId: body.productId,
        availableQuantity: body.availableQuantity,
        city: body.city,
        mrp: body.mrp,
        costPrice: body.costPrice,
        transportCost: body.transportCost || 0,
        storageCost: body.storageCost || 0,
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