import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { BooksModule } from './books/books.module.js';
import { BookCopiesModule } from './book-copies/book-copies.module.js';
import { LoansModule } from './loans/loans.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BooksModule,
    BookCopiesModule,
    LoansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
