import { AuthModule } from '../auth/auth.module.js';
import { BooksController } from './books.controller.js';
import { BooksService } from './books.service.js';
import { BooksRepository } from './books.repository.js';
import { Module } from '@nestjs/common';


@Module({
  imports: [AuthModule],
  controllers: [BooksController],
  providers: [BooksService, BooksRepository],
  exports: [BooksService],
})
export class BooksModule {}