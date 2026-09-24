import { Module } from '@nestjs/common';
import { BooksModule } from '../books/books.module.js';
import { BookCopiesController } from './book-copies.controller.js';
import { BookCopiesService } from './book-copies.service.js';
import { BookCopiesRepository } from './book-copies.repository.js';
import { AuthModule } from '../auth/auth.module.js';


@Module({
  imports: [AuthModule, BooksModule], // żeby móc wstrzyknąć BooksService w BookCopiesService
  controllers: [BookCopiesController],
  providers: [BookCopiesService, BookCopiesRepository],
})
export class BookCopiesModule {}