import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async placeOrder(userId: string, address: string, phone: string) {
  return this.prisma.$transaction(
    async (tx) => {

      // 1. Get cart items
      const cartItems = await tx.cart.findMany({
        where: { userId },
      });

      if (!cartItems.length) {
        throw new Error('Cart is empty');
      }

      const productIds = cartItems.map(item => item.productId);

      // 2. Fetch all products & inventory in ONE GO
      const [products, inventories] = await Promise.all([
        tx.product.findMany({
          where: { id: { in: productIds } },
        }),
        tx.inventory.findMany({
          where: { productId: { in: productIds } },
        }),
      ]);

      // Convert to map for fast lookup
      const productMap = new Map(products.map(p => [p.id, p]));
      const inventoryMap = new Map(inventories.map(i => [i.productId, i]));

      let totalPrice = 0;

      // 3. Validate stock
      for (const item of cartItems) {
        const inventory = inventoryMap.get(item.productId);

        if (!inventory || inventory.availableQuantity < item.quantity) {
          throw new Error(`Out of stock for product ${item.productId}`);
        }
      }

      // 4. Deduct inventory (atomic)
      for (const item of cartItems) {
        const inventory = inventoryMap.get(item.productId);

        await tx.inventory.update({
          where: { id: inventory.id },
          data: {
            availableQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 5. Calculate total
      for (const item of cartItems) {
        const product = productMap.get(item.productId);
        totalPrice += product.price * item.quantity;
      }

      // 6. Create order
      const order = await tx.order.create({
        data: {
          userId,
          status: 'PLACED',
          totalPrice,
          address,
          phone,
        },
      });

      // 7. Create order items (batch)
      await tx.orderItem.createMany({
        data: cartItems.map(item => {
          const product = productMap.get(item.productId);

          return {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          };
        }),
      });

      // 8. Clear cart
      await tx.cart.deleteMany({
        where: { userId },
      });

      return {
        success: true,
        orderId: order.id,
      };
    },
    {
      maxWait: 10000,   // fix connection timeout
      timeout: 20000,   // allow execution time
    },
  );
}
}