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
import { Body, Controller, Get, Param, Patch, Post, UseGuards, } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { ReservationsService } from './reservations.service.js';
let ReservationsController = class ReservationsController {
    reservationsService;
    constructor(reservationsService) {
        this.reservationsService = reservationsService;
    }
    create(dto, user) {
        return this.reservationsService.create(user.userId, dto);
    }
    findMyReservations(user) {
        return this.reservationsService.findMyReservations(user.userId);
    }
    cancel(id, user) {
        return this.reservationsService.cancel(id, user);
    }
    fulfill(id) {
        return this.reservationsService.fulfill(id);
    }
};
__decorate([
    Post(),
    ApiOperation({
        summary: 'Create book reservations',
        description: 'user can reserves a book',
    }),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateReservationDto, Object]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "create", null);
__decorate([
    Get('me'),
    ApiOperation({
        summary: 'Find book reservations by users',
        description: 'list all reservations by user',
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "findMyReservations", null);
__decorate([
    Patch(':id/cancel'),
    ApiOperation({
        summary: 'Cancel reservation',
        description: 'cancel reservation by book id',
    }),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "cancel", null);
__decorate([
    Patch(':id/fulfill'),
    Roles('librarian'),
    ApiOperation({
        summary: 'Fulfill reservation',
        description: 'fulfill reservation by book id',
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "fulfill", null);
ReservationsController = __decorate([
    Controller('reservations'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [ReservationsService])
], ReservationsController);
export { ReservationsController };
//# sourceMappingURL=reservations.controller.js.map