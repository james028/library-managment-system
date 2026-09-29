import { BooksService } from '../books/books.service.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { ReservationsRepository } from './reservations.repository.js';
export declare class ReservationsService {
    private readonly reservationsRepository;
    private readonly booksService;
    constructor(reservationsRepository: ReservationsRepository, booksService: BooksService);
    create(userId: string, dto: CreateReservationDto): Promise<import("./reservations.repository.js").ReservationRecord>;
    findMyReservations(userId: string): Promise<void>;
    cancel(reservationId: string, requestingUser: {
        userId: string;
        role: string;
    }): Promise<import("./reservations.repository.js").ReservationRecord>;
    fulfill(reservationId: string): Promise<import("./reservations.repository.js").ReservationRecord>;
}
