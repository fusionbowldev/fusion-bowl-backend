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
const product_module_1 = require("./modules/product/product.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const cart_module_1 = require("./modules/cart/cart.module");
const health_module_1 = require("./modules/health/health.module");
const order_module_1 = require("./modules/order/order.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            health_module_1.HealthModule,
            product_module_1.ProductModule,
            inventory_module_1.InventoryModule,
            cart_module_1.CartModule,
            order_module_1.OrderModule,
            admin_module_1.AdminModule
        ],
    })
], AppModule);
