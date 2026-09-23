var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { DatabaseService } from './database/database.service.js';
let AppController = class AppController {
    appService;
    databaseService;
    constructor(appService, databaseService) {
        this.appService = appService;
        this.databaseService = databaseService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async testDatabase() {
        const result = await this.databaseService.query(`
      SELECT
        current_database(),
        current_user;
    `);
        return result.rows[0];
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    Get('db-test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "testDatabase", null);
AppController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [AppService, DatabaseService])
], AppController);
export { AppController };
//# sourceMappingURL=app.controller.js.map