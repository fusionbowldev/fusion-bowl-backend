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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProductService = class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProduct(data) {
        return this.prisma.product.create({ data });
    }
    async getProducts(city = 'narasaraopet') {
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
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
function round(value) {
    return Math.round(value * 100) / 100;
}
