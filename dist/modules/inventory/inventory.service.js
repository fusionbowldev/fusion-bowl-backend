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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getInventory(productId, city) {
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
        if (!product)
            throw new common_1.BadRequestException('Product not found');
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
    async updateInventory(data) {
        const { productId, city, addedQuantity, costPrice, transportCost, storageCost, marginPercentage, discountPercentage = 0, } = data;
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
    async getInventoryForProducts(city) {
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
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
function round(value) {
    return Math.round(value * 100) / 100;
}
