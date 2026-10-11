import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getInventory(productId: string, city: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        category: true,
        isPerishable: true,
      },
    });

    if (!product) throw new BadRequestException('Product not found');

    const inventory = await this.prisma.inventory.findUnique({
      where: {
        productId_city: {
          productId,
          city,
        },
      },
    });

    if (!inventory) {
      return {
        hasData: false,
        ...product,
        currentStock: 0,
      };
    }

    const totalCost = inventory.costPrice + inventory.transportCost + inventory.storageCost;
    const sellingPrice = inventory.mrp - (inventory.mrp * inventory.discountPercentage) / 100;

    return {
      hasData: true,
      ...product,
      currentStock: inventory.availableQuantity,
      costPrice: inventory.costPrice,
      transportCost: inventory.transportCost,
      storageCost: inventory.storageCost,
      totalCost: round(totalCost),
      mrp: round(inventory.mrp),
      discountPercentage: inventory.discountPercentage,
      sellingPrice: round(sellingPrice),
      profit: round(sellingPrice - totalCost),
      lastUpdatedAt: inventory.updatedAt,
    };
  }

  async updateInventory(data: any) {
    const {
      productId,
      city,
      addedQuantity,
      costPrice,
      transportCost,
      storageCost,
      marginPercentage,
      discountPercentage = 0,
    } = data;

    const totalCost = costPrice + transportCost + storageCost;
    const mrp = totalCost + (totalCost * marginPercentage) / 100;

    const existing = await this.prisma.inventory.findUnique({
      where: {
        productId_city: {
          productId,
          city,
        },
      },
    });

    const updatedStock = (existing?.availableQuantity || 0) + addedQuantity;

    const inventory = await this.prisma.inventory.upsert({
      where: {
        productId_city: {
          productId,
          city,
        },
      },
      update: {
        availableQuantity: updatedStock,
        costPrice,
        transportCost,
        storageCost,
        mrp,
        discountPercentage,
      },
      create: {
        productId,
        city,
        availableQuantity: addedQuantity,
        costPrice,
        transportCost,
        storageCost,
        mrp,
        discountPercentage,
      },
    });

    return {
      success: true,
      inventory,
    };
  }

  async getInventoryForProducts(city: string) {
    return this.prisma.product.findMany({
      where: { isActive: true },
      include: {
        inventories: {
          where: { city },
          take: 1,
        },
      },
    });
  }
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
