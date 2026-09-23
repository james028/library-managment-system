var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { BooksRepository } from './books.repository.js';
let BooksService = class BooksService {
    booksRepository;
    constructor(booksRepository) {
        this.booksRepository = booksRepository;
    }
    async findAllBooks(page = 1, limit = 20, search) {
        const offset = (page - 1) * limit;
        const { items, total } = await this.booksRepository.findAllBooks({ limit, offset, search });
        return {
            items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const book = await this.booksRepository.findById(id);
        if (!book) {
            throw new NotFoundException(`Książka o id ${id} nie istnieje`);
        }
        return book;
    }
    create(dto) {
        return this.booksRepository.create(dto);
    }
    async update(id, dto) {
        const updated = await this.booksRepository.update(id, dto);
        if (!updated) {
            throw new NotFoundException(`Książka o id ${id} nie istnieje`);
        }
        return updated;
    }
    async remove(id) {
        const deleted = await this.booksRepository.delete(id);
        if (!deleted) {
            throw new NotFoundException(`Książka o id ${id} nie istnieje`);
        }
    }
};
BooksService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [BooksRepository])
], BooksService);
export { BooksService };
//# sourceMappingURL=books.service.js.map