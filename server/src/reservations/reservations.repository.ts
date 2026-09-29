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

export interface ReservationWithTitle extends ReservationRecord {
  book_title: string;
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
                                                                        VALUES ($1, $2,
                                                                                $3) RETURNING *`,
      [params.bookId, params.userId, params.expiresAt],
    );
    return result.rows[0];
  }

  async findReservationsForUser(userId: string): Promise<ReservationWithTitle[]> {
    const results = await this.databaseService.query<ReservationWithTitle>(
      `SELECT r.*, b.title AS book_title
       FROM reservations r
       JOIN books b ON b.id = r.book_id
       WHERE r.user_id = $1
       ORDER BY r.reserved_at DESC`
      , [userId],
    );


    return results.rows;
  }

  async findById(id: string): Promise<ReservationRecord | null> {
    const result = await this.databaseService.query<ReservationRecord>(
      `SELECT * FROM reservations WHERE id = $1`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  // to zabezpiecza przed np. anulowaniem czegoś, co już zostało zrealizowane.
  async updateStatus(id: string, newStatus: string): Promise<ReservationRecord | null> {
    const result = await this.databaseService.query<ReservationRecord>(
      `UPDATE reservations SET status = $1
       WHERE id = $2 AND status = 'pending'
       RETURNING *`,
      [newStatus, id],
    );
    return result.rows[0] ?? null;
  }
}
