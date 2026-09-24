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
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/createbook.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
let BooksController = class BooksController {
    booksService;
    constructor(booksService) {
        this.booksService = booksService;
    }
    findAll(page, limit, search) {
        return this.booksService.findAllBooks(page ? parseInt(page, 10) : undefined, limit ? parseInt(limit, 10) : undefined, search);
    }
    create(dto) {
        console.log(dto);
        return this.booksService.create(dto);
    }
};
__decorate([
    Get(),
    ApiOperation({
        summary: 'Get all books',
        description: 'Returns paginated list of books',
    }),
    ApiQuery({
        name: 'page',
        required: false,
        example: 1,
        description: 'Page number',
    }),
    ApiQuery({
        name: 'limit',
        required: false,
        example: 10,
        description: 'Number of books per page',
    }),
    ApiQuery({
        name: 'search',
        required: false,
        example: 'Clean Code',
        description: 'Search by book title',
    }),
    ApiResponse({
        status: 200,
        description: 'Books returned successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'JWT token is missing or invalid.',
    }),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __param(2, Query('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "findAll", null);
__decorate([
    Post(),
    Roles('member'),
    ApiOperation({
        summary: 'Create a book',
        description: 'Creates a new book. Requires librarian role.',
    }),
    ApiResponse({
        status: 201,
        description: 'Book created successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'JWT token is missing or invalid.',
    }),
    ApiResponse({
        status: 403,
        description: 'User does not have librarian role.',
    }),
    ApiResponse({
        status: 409,
        description: 'Book with this ISBN already exists.',
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateBookDto]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "create", null);
BooksController = __decorate([
    Controller('books'),
    ApiTags('Books'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [BooksService])
], BooksController);
export { BooksController };
//# sourceMappingURL=books.controller.js.map