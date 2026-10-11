import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomException } from '../../utils/exceptions/custom.exception';
import { ErrorCodes } from '../../utils/constants/error.codes';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async add(
    userId: string,
    productId: string,
    quantity: number,
    city: string,
  ) {

    // 1. Quantity validation
    if (!quantity || quantity <= 0) {
      throw new CustomException(
        ErrorCodes.INVALID_QUANTITY,
        'Quantity should be greater than 0',
      );
    }

    // 2. Product validation
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new CustomException(
        ErrorCodes.PRODUCT_NOT_FOUND,
        'Product not found',
        404,
      );
    }

    // 3. Active validation
    if (!product.isActive) {
      throw new CustomException(
        ErrorCodes.PRODUCT_INACTIVE,
        'Product is inactive',
        404,
      );
    }

    // 4. Inventory validation
    const inventory =
      await this.prisma.inventory.findUnique({
        where: {
          productId_city: {
            productId,
            city,
          },
        },
      });

    if (!inventory) {
      throw new NotFoundException(
        'Inventory not found for city',
      );
    }

    // 5. Existing cart item
    const existingCartItem =
      await this.prisma.cart.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

    const existingQty =
      existingCartItem?.quantity || 0;

    const finalQty =
      existingQty + quantity;

    // 6. Stock validation
    if (
      finalQty >
      inventory.availableQuantity
    ) {
      throw new BadRequestException(
        `Only ${inventory.availableQuantity} KG available`,
      );
    }

    // 7. Add / update cart
    return this.prisma.cart.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },

      update: {
        quantity: {
          increment: quantity,
        },
      },

      create: {
        userId,
        productId,
        quantity,
      },
    });
  }

  async getCart(userId: string, city: string) {

    const cartItems = await this.prisma.cart.findMany({
      where: { userId },
    });

    if (!cartItems.length) {
      return [];
    }

    const productIds =
      cartItems.map(item => item.productId);

    const [products, inventories] =
      await Promise.all([

        this.prisma.product.findMany({
          where: {
            id: { in: productIds },
          },
        }),

        this.prisma.inventory.findMany({
          where: {
            productId: { in: productIds },
            city,
          },
        }),
      ]);

    const productMap = new Map(
      products.map(p => [p.id, p]),
    );

    const inventoryMap = new Map(
      inventories.map(i => [
        `${i.productId}_${i.city}`,
        i,
      ]),
    );

    return cartItems.map(item => {

      const product =
        productMap.get(item.productId);

      const inventory =
        inventoryMap.get(
          `${item.productId}_${city}`,
        );

      if (!product || !inventory) {
        return null;
      }

      return {

        cartItemId: item.id,

        productId: product.id,

        name: product.name,

        imageUrl: product.imageUrl,

        category: product.category,

        quantity: item.quantity,

        mrp: inventory.mrp,

        discountPercentage:
          inventory.discountPercentage,

        currentStock:
          inventory.availableQuantity,

        isAvailable:
          inventory.availableQuantity > 0,
      };
    }).filter(Boolean);
  }
}
