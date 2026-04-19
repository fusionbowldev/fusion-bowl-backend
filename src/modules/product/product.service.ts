import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProducts() {
  console.log("Fetching products...");
  return this.prisma.product.findMany({
    where: { isActive: true },
  });
  }
}
