import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller.js';
import { ReservationsService } from './reservations.service.js';
import { ReservationsRepository } from './reservations.repository.js';
import { AuthModule } from '../auth/auth.module.js';
import { BooksModule } from '../books/books.module.js';

@Module({
  imports: [AuthModule, BooksModule], // BooksModule — bo service wstrzykuje BooksService
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})

export class ReservationsModule {}