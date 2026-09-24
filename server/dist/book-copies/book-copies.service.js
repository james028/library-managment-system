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
import { BookCopiesRepository } from './book-copies.repository.js';
import { BooksService } from '../books/books.service.js';
let BookCopiesService = class BookCopiesService {
    bookCopiesRepository;
    booksService;
    constructor(bookCopiesRepository, booksService) {
        this.bookCopiesRepository = bookCopiesRepository;
        this.booksService = booksService;
    }
    async findAllForBook(bookId) {
        await this.booksService.findOne(bookId);
        return this.bookCopiesRepository.findAllByBookId(bookId);
    }
    async create(bookId, dto) {
        await this.booksService.findOne(bookId);
        console.log(bookId, dto, 'copies');
        try {
            return await this.bookCopiesRepository.create(bookId, dto);
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, dto) {
        const updated = await this.bookCopiesRepository.update(id, dto);
        if (!updated) {
            throw new NotFoundException(`Egzemplarz o id ${id} nie istnieje`);
        }
        return updated;
    }
    async delete(copyId) {
        const deleted = await this.bookCopiesRepository.delete(copyId);
        if (deleted) {
            throw new NotFoundException(`Egzemplarz o id ${copyId} nie istnieje`);
        }
    }
};
BookCopiesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [BookCopiesRepository, BooksService])
], BookCopiesService);
export { BookCopiesService };
//# sourceMappingURL=book-copies.service.js.map