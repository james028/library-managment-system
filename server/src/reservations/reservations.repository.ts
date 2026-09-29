import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';


export interface ReservationRecord {
  id: string;
  book_id: string;
  user_id: string;
  reserved_at: Date;
  expires_at: Date;
  status: string;
}

@Injectable()
export class ReservationsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(params: {
    bookId: string;
    userId: string;
    expiresAt: Date;
  }): Promise<ReservationRecord> {
    const result = await this.databaseService.query<ReservationRecord>(
      `INSERT INTO reservations (book_id, user_id, expires_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [params.bookId, params.userId, params.expiresAt],
    );
    return result.rows[0];
  }
}