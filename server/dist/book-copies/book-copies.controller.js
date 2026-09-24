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
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards, } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreateBookCopyDto } from './dto/create-book-copy.dto.js';
import { BookCopiesService } from './book-copies.service.js';
import { UpdateBookCopyDto } from './dto/update-book-copy.dto.js';
let BookCopiesController = class BookCopiesController {
    bookCopiesService;
    constructor(bookCopiesService) {
        this.bookCopiesService = bookCopiesService;
    }
    findAllForBook(bookId) {
        return this.bookCopiesService.findAllForBook(bookId);
    }
    create(bookId, dto) {
        return this.bookCopiesService.create(bookId, dto);
    }
    update(id, dto) {
        return this.bookCopiesService.update(id, dto);
    }
    remove(id) {
        return this.bookCopiesService.delete(id);
    }
};
__decorate([
    Get('/:bookId/copies'),
    __param(0, Param('bookId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookCopiesController.prototype, "findAllForBook", null);
__decorate([
    Post('/:bookId/copies'),
    __param(0, Param('bookId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateBookCopyDto]),
    __metadata("design:returntype", void 0)
], BookCopiesController.prototype, "create", null);
__decorate([
    Patch('copies/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateBookCopyDto]),
    __metadata("design:returntype", void 0)
], BookCopiesController.prototype, "update", null);
__decorate([
    Delete('copies/:id'),
    HttpCode(HttpStatus.NO_CONTENT),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookCopiesController.prototype, "remove", null);
BookCopiesController = __decorate([
    Controller('book'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('member'),
    __metadata("design:paramtypes", [BookCopiesService])
], BookCopiesController);
export { BookCopiesController };
//# sourceMappingURL=book-copies.controller.js.map