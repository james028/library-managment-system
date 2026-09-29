import { DatabaseService } from '../database/database.service.js';
export interface ReservationRecord {
    id: string;
    book_id: string;
    user_id: string;
    reserved_at: Date;
    expires_at: Date;
    status: string;
}
export interface ReservationWithTitle extends ReservationRecord {
    book_title: string;
}
export declare class ReservationsRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(params: {
        bookId: string;
        userId: string;
        expiresAt: Date;
    }): Promise<ReservationRecord>;
    findReservationsForUser(userId: string): Promise<ReservationWithTitle[]>;
    findById(id: string): Promise<ReservationRecord | null>;
    updateStatus(id: string, newStatus: string): Promise<ReservationRecord | null>;
}
