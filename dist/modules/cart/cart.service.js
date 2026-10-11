"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const custom_exception_1 = require("../../utils/exceptions/custom.exception");
const error_codes_1 = require("../../utils/constants/error.codes");
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async add(userId, productId, quantity, city) {
        // 1. Quantity validation
        if (!quantity || quantity <= 0) {
            throw new custom_exception_1.CustomException(error_codes_1.ErrorCodes.INVALID_QUANTITY, 'Quantity should be greater than 0');
        }
        // 2. Product validation
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new custom_exception_1.CustomException(error_codes_1.ErrorCodes.PRODUCT_NOT_FOUND, 'Product not found', 404);
        }
        // 3. Active validation
        if (!product.isActive) {
            throw new custom_exception_1.CustomException(error_codes_1.ErrorCodes.PRODUCT_INACTIVE, 'Product is inactive', 404);
        }
        // 4. Inventory validation
        const inventory = await this.prisma.inventory.findUnique({
            where: {
                productId_city: {
                    productId,
                    city,
                },
            },
        });
        if (!inventory) {
            throw new common_1.NotFoundException('Inventory not found for city');
        }
        // 5. Existing cart item
        const existingCartItem = await this.prisma.cart.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });
        const existingQty = existingCartItem?.quantity || 0;
        const finalQty = existingQty + quantity;
        // 6. Stock validation
        if (finalQty >
            inventory.availableQuantity) {
            throw new common_1.BadRequestException(`Only ${inventory.availableQuantity} KG available`);
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
    async getCart(userId, city) {
        const cartItems = await this.prisma.cart.findMany({
            where: { userId },
        });
        if (!cartItems.length) {
            return [];
        }
        const productIds = cartItems.map(item => item.productId);
        const [products, inventories] = await Promise.all([
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
        const productMap = new Map(products.map(p => [p.id, p]));
        const inventoryMap = new Map(inventories.map(i => [
            `${i.productId}_${i.city}`,
            i,
        ]));
        return cartItems.map(item => {
            const product = productMap.get(item.productId);
            const inventory = inventoryMap.get(`${item.productId}_${city}`);
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
                discountPercentage: inventory.discountPercentage,
                currentStock: inventory.availableQuantity,
                isAvailable: inventory.availableQuantity > 0,
            };
        }).filter(Boolean);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_2.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
