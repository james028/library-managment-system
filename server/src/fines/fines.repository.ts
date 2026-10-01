import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

export interface FineRecord {
  id: string;
  loan_id: string;
  amount: string; // NUMERIC z pg przychodzi jako string — patrz uwaga w README
  paid: boolean;
  created_at: Date;
}

export interface FineWithDetails extends FineRecord {
  book_title: string;
  user_id: string;
}

@Injectable()
export class FinesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllForUser(userId: string): Promise<any> {


    const results = await this.databaseService.query<FineWithDetails>(
      `
          SELECT f.*, l.user_id, b.title, b.published_year
          FROM fines f
                   JOIN loans l ON l.id = f.loan_id
          JOIN book_copies bc ON bc.id = l.book_copy_id
          JOIN books b ON b.id = bc.book_id
        WHERE l.user_id = $1
          ORDER BY f.created_at DESC
    `,
      [userId],
    );

    console.log(results.rows);

    return results.rows;
  }
}
