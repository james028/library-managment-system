var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { BooksModule } from '../books/books.module.js';
import { BookCopiesController } from './book-copies.controller.js';
import { BookCopiesService } from './book-copies.service.js';
import { BookCopiesRepository } from './book-copies.repository.js';
import { AuthModule } from '../auth/auth.module.js';
let BookCopiesModule = class BookCopiesModule {
};
BookCopiesModule = __decorate([
    Module({
        imports: [AuthModule, BooksModule],
        controllers: [BookCopiesController],
        providers: [BookCopiesService, BookCopiesRepository],
    })
], BookCopiesModule);
export { BookCopiesModule };
//# sourceMappingURL=book-copies.module.js.map