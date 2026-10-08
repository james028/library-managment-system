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

export interface LoansSummary {
  activeLoans: number;
  overdueLoans: number;
  toReturnToday: number;
  returnedToday: number;
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

  async returnLoan(
    id: string,
    fineRatePerDay: number,
  ): Promise<LoanRecord | null> {
    const client = await this.databaseService.getClient();

    try {
      client.query('BEGIN');

      const loanUpdate = await client.query<LoanRecord>(
        `UPDATE loans
                                                         SET returned_at = now()
                                                         WHERE id = $1
                                                           AND returned_at IS NULL RETURNING *`,
        [id],
      );

      if (loanUpdate.rowCount === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      const loan = loanUpdate.rows[0];

      await client.query(
        `UPDATE book_copies
                          SET status     = 'available',
                              updated_at = now()
                          WHERE id = $1`,
        [loan.book_copy_id],
      );

      const msOverdue = Date.now() - new Date(loan.due_at).getTime();
      const daysOverdue = Math.floor(msOverdue / (24 * 60 * 60 * 1000));

      let fineAmount: number | null = null;

      if (daysOverdue > 0) {
        fineAmount = Math.round(daysOverdue * fineRatePerDay * 100) / 100;
        await client.query(
          'INSERT INTO fines (loan_id, amount) VALUES ($1, $2, $3)',
          [loan.id, fineAmount],
        );
      }

      await client.query('COMMIT');
      return loan;
    } catch (error) {
      client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findAllForUser(userId: string): Promise<LoanWithDetails[]> {
    const result = await this.databaseService.query<LoanWithDetails>(
      `SELECT l.*, b.title AS book_title, bc.inventory_number
                                                                      FROM loans l
                                                                               JOIN book_copies bc ON bc.id = l.book_copy_id
                                                                               JOIN books b ON b.id = bc.book_id
                                                                      WHERE l.user_id = $1
                                                                      ORDER BY l.borrowed_at DESC`,
      [userId],
    );
    return result.rows;
  }

  async returnSummaryData(): Promise<LoansSummary> {
    const results = await this.databaseService.query<LoansSummary>(
      `
        SELECT (SELECT COUNT(*)
                FROM loans
                WHERE returned_at IS NULL)        AS "activeLoans",

               (SELECT COUNT(*)
                FROM loans
                WHERE returned_at IS NULL
                  AND due_at < CURRENT_TIMESTAMP) AS "overdueLoans",
               (SELECT COUNT(*)
                FROM loans
                WHERE returned_at IS NULL
                  AND returned_at = CURRENT_DATE) AS "toReturnToday",
               (SELECT COUNT(*)
                FROM loans
                WHERE returned_at >= CURRENT_DATE
                  AND returned_at < CURRENT_DATE + INTERVAL '1 day'
        ) AS "returnedToday"
    `,
      [],
    );

    return results.rows[0];
  }
}
