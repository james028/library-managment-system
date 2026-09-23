import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { CreateBookDto } from './dto/createbook.dto.js';
import { UpdateBookDto } from './dto/updatebook.dto.js';

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
      `SELECT *
                                                                     FROM books ${whereClause}
                                                                     ORDER BY created_at DESC
                                                                         LIMIT $1
                                                                     OFFSET $2`,
      values,
    );

    const countResult = await this.databaseService.query<{ count: string }>(
      `SELECT COUNT(*)
                                                                             FROM books ${whereClause}`,
      search ? [`%${search}%`] : [],
    );

    return {
      items: dataResult.rows,
      total: parseInt(countResult.rows[0].count, 10),
    };
  }

  async create(dto: CreateBookDto): Promise<BookRecord> {
    const result = await this.databaseService.query<BookRecord>(
      `INSERT INTO books (title, author, isbn, publisher, published_year, description)
                                                      VALUES ($1, $2, $3, $4, $5,
                                                              $6) RETURNING *`,
      [
        dto.title,
        dto.author,
        dto.isbn ?? null,
        dto.publisher ?? null,
        dto.publishedYear ?? null,
        dto.description ?? null,
      ],
    );
    return result.rows[0];
  }

  async findById(id: string): Promise<BookRecord | null> {
    const result = await this.databaseService.query<BookRecord>(
      `SELECT *
                                                                 FROM books
                                                                 WHERE id = $1`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  async update(id: string, dto: UpdateBookDto): Promise<BookRecord | null> {
    // Budujemy UPDATE dynamicznie, bo PATCH może przyjść z dowolnym podzbiorem pól.
    // To trochę więcej roboty niż z ORM-em (Prisma zrobiłaby to za Ciebie) —
    // ale dzięki temu widzisz dokładnie, jak taki dynamiczny SQL się konstruuje.
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    const fieldMap: Record<string, unknown> = {
      title: dto.title,
      author: dto.author,
      isbn: dto.isbn,
      publisher: dto.publisher,
      published_year: dto.publishedYear,
      description: dto.description,
    };

    for (const [column, value] of Object.entries(fieldMap)) {
      if (value !== undefined) {
        fields.push(`${column} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    console.log(fields, values);

    if (fields.length === 0) {
      return this.findById(id); // nic do zmiany, po prostu zwróć aktualny stan
    }

    fields.push(`updated_at = now()`);
    values.push(id);

    const result = await this.databaseService.query<BookRecord>(
      `UPDATE books SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values,
    );

    return result.rows[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.databaseService.query(
      `DELETE
                                                     FROM books
                                                     WHERE id = $1`,
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }
}
