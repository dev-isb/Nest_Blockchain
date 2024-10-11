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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceController = void 0;
const common_1 = require("@nestjs/common");
const price_service_1 = require("./price.service");
let PriceController = class PriceController {
    constructor(priceService) {
        this.priceService = priceService;
    }
    async getHourlyPrices(chain) {
        return this.priceService.getHourlyPrices(chain);
    }
    async getSwapRate(ethAmount) {
        return this.priceService.getSwapRate(ethAmount);
    }
    async setAlert(chain, targetPrice, email) {
        return this.priceService.setAlert(chain, targetPrice, email);
    }
    async sendEmail() {
        return this.priceService.sendEmailTest();
    }
};
exports.PriceController = PriceController;
__decorate([
    (0, common_1.Get)('hourly/:chain'),
    __param(0, (0, common_1.Param)('chain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PriceController.prototype, "getHourlyPrices", null);
__decorate([
    (0, common_1.Get)('swap-rate'),
    __param(0, (0, common_1.Query)('ethAmount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PriceController.prototype, "getSwapRate", null);
__decorate([
    (0, common_1.Post)('alert'),
    __param(0, (0, common_1.Body)('chain')),
    __param(1, (0, common_1.Body)('targetPrice')),
    __param(2, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], PriceController.prototype, "setAlert", null);
__decorate([
    (0, common_1.Get)("mail"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PriceController.prototype, "sendEmail", null);
exports.PriceController = PriceController = __decorate([
    (0, common_1.Controller)('price'),
    __metadata("design:paramtypes", [price_service_1.PriceService])
], PriceController);
//# sourceMappingURL=price.controller.js.map