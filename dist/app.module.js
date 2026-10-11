"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const admin_controller_1 = require("./modules/admin/admin.controller");
const admin_service_1 = require("./modules/admin/admin.service");
const cart_controller_1 = require("./modules/cart/cart.controller");
const cart_service_1 = require("./modules/cart/cart.service");
const inventory_controller_1 = require("./modules/inventory/inventory.controller");
const inventory_service_1 = require("./modules/inventory/inventory.service");
const order_controller_1 = require("./modules/order/order.controller");
const order_service_1 = require("./modules/order/order.service");
const product_controller_1 = require("./modules/product/product.controller");
const product_service_1 = require("./modules/product/product.service");
const prisma_service_1 = require("./prisma/prisma.service");
const health_controller_1 = require("./health.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [
            health_controller_1.HealthController,
            admin_controller_1.AdminController,
            cart_controller_1.CartController,
            inventory_controller_1.InventoryController,
            order_controller_1.OrderController,
            product_controller_1.ProductController,
        ],
        providers: [
            admin_service_1.AdminService,
            cart_service_1.CartService,
            inventory_service_1.InventoryService,
            order_service_1.OrderService,
            product_service_1.ProductService,
            prisma_service_1.PrismaService,
        ],
    })
], AppModule);
