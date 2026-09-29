import { Injectable } from '@nestjs/common';
import { BooksService } from '../books/books.service.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import {ReservationsRepository } from './reservations.repository.js';

const RESERVATION_DAYS = 3;

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    private readonly booksService: BooksService,
  ) {}

  async create(userId: string, dto: CreateReservationDto) {
    await this.booksService.findOne(dto.bookId); // 404, jeśli książka nie istnieje

    const expiresAt = new Date(
      Date.now() + RESERVATION_DAYS * 24 * 60 * 60 * 1000,
    );

    return this.reservationsRepository.create({
      bookId: dto.bookId,
      userId,
      expiresAt,
    });
  }
}
