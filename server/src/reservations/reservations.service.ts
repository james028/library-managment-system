import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BooksService } from '../books/books.service.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { ReservationsRepository } from './reservations.repository.js';

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

  async findMyReservations(userId: string) {
    return await this.reservationsRepository.findReservationsForUser(userId);
  }

  async cancel(
    reservationId: string,
    requestingUser: { userId: string; role: string },
  ) {
    const reservation =
      await this.reservationsRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundException('Rezerwacja nie istnieje');
    }

    const isOwner =
      reservation?.user_id === requestingUser.userId &&
      requestingUser.role === 'member';
    const isLibrarian = requestingUser.role === 'librarian';

    if (!isOwner && !isLibrarian) {
      throw new ForbiddenException('Nie możesz anulować cudzej rezerwacji');
    }

    const updated = await this.reservationsRepository.updateStatus(
      reservation.id,
      'cancelled',
    );

    if (!updated) {
      // Rezerwacja istniała (sprawdziliśmy wyżej), ale nie miała statusu 'pending' —
      // czyli już została zrealizowana albo anulowana wcześniej.
      throw new ConflictException(
        'Tej rezerwacji nie można już anulować (zmieniła status)',
      );
    }

    return updated;
  }

  async fulfill(reservationId: string) {
    const updated = await this.reservationsRepository.updateStatus(
      reservationId,
      'fulfilled',
    );

    if (!updated) {
      // Rezerwacja istniała (sprawdziliśmy wyżej), ale nie miała statusu 'pending' —
      // czyli już została zrealizowana albo anulowana wcześniej.
      throw new ConflictException(
        'Tej rezerwacji nie można już anulować (zmieniła status)',
      );
    }

    return updated;
  }
}
