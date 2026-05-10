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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // Create Sub Admin
    async createSubAdmin(body) {
        return this.prisma.admin.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password, // hash later
                role: 'SUB_ADMIN',
            },
        });
    }
    // Create Product
    async createProduct(body) {
        return this.prisma.product.create({
            data: {
                name: body.name,
                category: body.category,
                price: body.price,
                imageUrl: body.imageUrl,
                benefits: body.benefits,
                storageTips: body.storageTips,
                consumptionTips: body.consumptionTips,
                tags: body.tags,
            },
        });
    }
    // Update Product
    async updateProduct(id, body) {
        return this.prisma.product.update({
            where: { id },
            data: body,
        });
    }
    // Update Inventory (weekly stock)
    async updateInventory(body) {
        return this.prisma.inventory.upsert({
            where: {
                id: body.id || '',
            },
            update: {
                availableQuantity: {
                    increment: body.availableQuantity,
                },
            },
            create: {
                productId: body.productId,
                availableQuantity: body.availableQuantity,
                weekStartDate: new Date(),
            },
        });
    }
    // Get Orders (with items)
    async getOrders() {
        return this.prisma.order.findMany({
            include: {
                items: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    // Update Order Status
    async updateOrderStatus(orderId, status) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: {
                status,
            },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
