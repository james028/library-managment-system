import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

export interface LoanRecord {
  id: string;
  book_copy_id: string;
  user_id: string;
  borrowed_at: Date;
  due_at: Date;
  returned_at: Date | null;
  extended_count: number;
}

export interface LoanWithDetails extends LoanRecord {
  book_title: string;
  inventory_number: string;
}

@Injectable()
export class LoansRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async borrow(params: {
    bookCopyId: string;
    userId: string;
    dueAt: Date; //@ts-ignore
  }): Promise<LoanRecord | null> {
    const client = await this.databaseService.getClient();

    try {
      client.query('BEGIN');

      // Warunek "AND status = 'available'" w WHERE to zabezpieczenie przed race condition:
      // gdyby dwóch bibliotekarzy próbowało wypożyczyć ten sam egzemplarz w tej samej chwili,
      // tylko jeden UPDATE faktycznie coś zmieni (drugi trafi na status już 'checked_out' i zwróci 0 wierszy).
      const copyUpdate = await client.query(
        `UPDATE book_copies
                                             SET status     = 'checked_out',
                                                 updated_at = now()
                                             WHERE id = $1
                                               AND status = 'available' RETURNING id`,
        [params.bookCopyId],
      );

      if (copyUpdate.rowCount === 0) {
        await client.query('ROLLBACK');
        return null; // egzemplarz niedostępny — service zamieni to na odpowiedni wyjątek
      }

      const loanInsert = await client.query<LoanRecord>(
        `INSERT INTO loans (book_copy_id, user_id, due_at)
                                                         VALUES ($1, $2,
                                                                 $3) RETURNING *`,
        [params.bookCopyId, params.userId, params.dueAt],
      );

      await client.query('COMMIT');
      return loanInsert.rows[0];
    } catch (error) {
      client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<LoanRecord | null> {
    const result = await this.databaseService.query<LoanRecord>(
      `SELECT *
                                                                 FROM loans
                                                                 WHERE id = $1`,
      [id],
    );
    return result.rows[0] ?? null;
  }
}
