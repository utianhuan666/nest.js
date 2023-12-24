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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const qrcode = require("qrcode");
const crypto = require("crypto");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async generate() {
        const uuid = crypto.randomUUID();
        const dataUrl = await qrcode.toDataURL(`http://192.168.31.99:3000/pages/confirm.html?id=${uuid}`);
        await this.redisClient.set(`qrcode_${uuid}`, JSON.stringify({
            status: "no-scan"
        }));
        return {
            qrcode_id: uuid,
            img: dataUrl
        };
    }
    async check(id) {
        return this.redisClient.get(`qrcode_${id}`);
    }
    async scan(id) {
        const info = await this.redisClient.get(`qrcode_${id}`);
        console.log(info);
        if (!info) {
            throw new common_1.BadRequestException(info);
        }
        await this.redisClient.set(`qrcode_${id}`, JSON.stringify({
            status: "scan-wait-confirm"
        }));
        return 'success';
    }
    async confirm(id) {
        const info = await this.redisClient.get(`qrcode_${id}`);
        if (!info) {
            throw new common_1.BadRequestException('二维码已过期');
        }
        await this.redisClient.set(`qrcode_${id}`, JSON.stringify({
            status: "scan-confirm"
        }));
        return 'success';
    }
    async cancel(id) {
        const info = await this.redisClient.get(`qrcode_${id}`);
        if (!info) {
            throw new common_1.BadRequestException('二维码已过期');
        }
        await this.redisClient.set(`qrcode_${id}`, JSON.stringify({
            status: "scan-cancel"
        }));
        return 'success';
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Inject)("REDIS_CLIENT"),
    __metadata("design:type", Object)
], AppController.prototype, "redisClient", void 0);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)("qrcode/generate"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "generate", null);
__decorate([
    (0, common_1.Get)("qrcode/check"),
    __param(0, (0, common_1.Query)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "check", null);
__decorate([
    (0, common_1.Get)("qrcode/scan"),
    __param(0, (0, common_1.Query)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "scan", null);
__decorate([
    (0, common_1.Get)('qrcode/confirm'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "confirm", null);
__decorate([
    (0, common_1.Get)('qrcode/cancel'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "cancel", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map