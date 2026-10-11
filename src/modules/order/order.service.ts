import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async placeOrder(userId: string, address: string, phone: string, city: string) {
    return this.prisma.$transaction(async (tx) => {
      const cartItems = await tx.cart.findMany({ where: { userId } });

      if (!cartItems.length) {
        throw new Error('Cart is empty');
      }

      const productIds = cartItems.map((item) => item.productId);

      const [products, inventories] = await Promise.all([
        tx.product.findMany({ where: { id: { in: productIds } } }),
        tx.inventory.findMany({ where: { productId: { in: productIds }, city } }),
      ]);

      const productMap = new Map(products.map((p) => [p.id, p]));
      const inventoryMap = new Map(inventories.map((i) => [`${i.productId}_${i.city}`, i]));

      let subtotal = 0;
      const orderItemsData: any[] = [];

      for (const item of cartItems) {
        const product = productMap.get(item.productId);
        const inventory = inventoryMap.get(`${item.productId}_${city}`);

        if (!product || !inventory) {
          throw new Error(`Product unavailable: ${item.productId}`);
        }

        if (inventory.availableQuantity < item.quantity) {
          throw new Error(`Out of stock: ${product.name}`);
        }

        const mrp = inventory.mrp;
        const discountPercentage = inventory.discountPercentage || 0;
        const sellingPrice = mrp - (mrp * discountPercentage) / 100;
        const itemTotal = sellingPrice * item.quantity;

        subtotal += itemTotal;

        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          productImageUrl: product.imageUrl,
          quantity: item.quantity,
          mrp,
          discountPercentage,
          sellingPrice,
          price: sellingPrice,
        });
      }

      const handlingCharge = [...new Set(cartItems.map(i => i.productId))].length * 3;
      const deliveryCharge = calculateDelivery(subtotal);
      const finalPayable = subtotal + handlingCharge + deliveryCharge;

      for (const item of cartItems) {
        const inventory = inventoryMap.get(`${item.productId}_${city}`);

        await tx.inventory.update({
          where: { id: inventory.id },
          data: {
            availableQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          status: 'PLACED',
          subtotal: round(subtotal),
          handlingCharge,
          deliveryCharge,
          finalPayable: round(finalPayable),
          totalPrice: round(finalPayable),
          city,
          address,
          phone,
        },
      });

      await tx.orderItem.createMany({
        data: orderItemsData.map((item) => ({
          ...item,
          orderId: order.id,
        })),
      });

      await tx.cart.deleteMany({ where: { userId } });

      return {
        success: true,
        orderId: order.id,
        pricing: {
          subtotal: round(subtotal),
          handlingCharge,
          deliveryCharge,
          finalPayable: round(finalPayable),
        },
      };
    });
  }
}

function calculateDelivery(subtotal: number) {
  if (subtotal >= 300) return 0;
  if (subtotal >= 200) return 10;
  if (subtotal >= 100) return 20;
  return 30;
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
