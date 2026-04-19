import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getStock(productId: string) {
    return this.prisma.inventory.findFirst({
      where: { productId },
      orderBy: { weekStartDate: 'desc' },
    });
  }
}
