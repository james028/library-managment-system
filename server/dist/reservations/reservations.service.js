var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { BooksService } from '../books/books.service.js';
import { ReservationsRepository } from './reservations.repository.js';
const RESERVATION_DAYS = 3;
let ReservationsService = class ReservationsService {
    reservationsRepository;
    booksService;
    constructor(reservationsRepository, booksService) {
        this.reservationsRepository = reservationsRepository;
        this.booksService = booksService;
    }
    async create(userId, dto) {
        await this.booksService.findOne(dto.bookId);
        const expiresAt = new Date(Date.now() + RESERVATION_DAYS * 24 * 60 * 60 * 1000);
        return this.reservationsRepository.create({
            bookId: dto.bookId,
            userId,
            expiresAt,
        });
    }
    async findMyReservations(userId) {
        await this.reservationsRepository.findReservationsForUser(userId);
    }
    async cancel(reservationId, requestingUser) {
        const reservation = await this.reservationsRepository.findById(reservationId);
        if (!reservation) {
            throw new NotFoundException('Rezerwacja nie istnieje');
        }
        const isOwner = reservation?.user_id === requestingUser.userId &&
            requestingUser.role === 'member';
        const isLibrarian = requestingUser.role === 'librarian';
        if (!isOwner && !isLibrarian) {
            throw new ForbiddenException('Nie możesz anulować cudzej rezerwacji');
        }
        const updated = await this.reservationsRepository.updateStatus(reservation.id, 'cancelled');
        if (!updated) {
            throw new ConflictException('Tej rezerwacji nie można już anulować (zmieniła status)');
        }
        return updated;
    }
    async fulfill(reservationId) {
        const updated = await this.reservationsRepository.updateStatus(reservationId, 'fulfilled');
        if (!updated) {
            throw new ConflictException('Tej rezerwacji nie można już anulować (zmieniła status)');
        }
        return updated;
    }
};
ReservationsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ReservationsRepository,
        BooksService])
], ReservationsService);
export { ReservationsService };
//# sourceMappingURL=reservations.service.js.map