import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: any) {
    return this.prisma.product.create({ data });
  }

  async getProducts(city: string = 'narasaraopet') {
    const products = await this.prisma.product.findMany({
      where: { isActive: true },
      include: {
        inventories: {
          where: { city },
          take: 1,
        },
      },
    });

    return products.map((product) => {
      const inventory = product.inventories[0];

      if (!inventory) {
        return {
          id: product.id,
          name: product.name,
          category: product.category,
          isPerishable: product.isPerishable,
          imageUrl: product.imageUrl,
          benefits: product.benefits,
          storageTips: product.storageTips,
          consumptionTips: product.consumptionTips,
          tags: product.tags,
          currentStock: 0,
          mrp: null,
          discountPercentage: 0,
          finalPrice: null,
          isAvailable: false,
        };
      }

      const finalPrice = inventory.mrp - (inventory.mrp * inventory.discountPercentage) / 100;

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        isPerishable: product.isPerishable,
        imageUrl: product.imageUrl,
        benefits: product.benefits,
        storageTips: product.storageTips,
        consumptionTips: product.consumptionTips,
        tags: product.tags,
        currentStock: inventory.availableQuantity,
        mrp: round(inventory.mrp),
        discountPercentage: inventory.discountPercentage,
        finalPrice: round(finalPrice),
        isAvailable: inventory.availableQuantity > 0,
      };
    });
  }
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
