import { DatabaseService } from '../database/database.service.js';
export interface ReservationRecord {
    id: string;
    book_id: string;
    user_id: string;
    reserved_at: Date;
    expires_at: Date;
    status: string;
}
export declare class ReservationsRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(params: {
        bookId: string;
        userId: string;
        expiresAt: Date;
    }): Promise<ReservationRecord>;
}
