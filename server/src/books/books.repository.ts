import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

export interface BookRecord {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  publisher: string | null;
  published_year: number | null;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class BooksRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllBooks(params: {
    limit: number;
    offset: number;
    search?: string;
  }) {
    const { limit, offset, search } = params;

    // Dwa warianty zapytania: z wyszukiwaniem po tytule/autorze i bez.
    // ILIKE = case-insensitive LIKE w Postgresie.
    const whereClause = search ? `WHERE title ILIKE $3 OR author ILIKE $3` : '';
    const values: (string | number)[] = search
      ? [limit, offset, `%${search}%`]
      : [limit, offset];

    const dataResult = await this.databaseService.query<BookRecord>(
      `SELECT * FROM books ${whereClause}
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      values,
    );


    const countResult = await this.databaseService.query<{ count: string }>(
      `SELECT COUNT(*) FROM books ${whereClause}`,
      search ? [`%${search}%`] : [],
    );

    return {
      items: dataResult.rows,
      total: parseInt(countResult.rows[0].count, 10),
    };

  }

  async findById(id: string): Promise<BookRecord | null> {
    const result = await this.databaseService.query<BookRecord>(
      `SELECT * FROM books WHERE id = $1`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.databaseService.query(`DELETE FROM books WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
