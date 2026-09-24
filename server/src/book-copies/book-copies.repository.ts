// Rozszerzony rekord z tytułem książki, doklejonym przez JOIN — przyda się w widokach,
// gdzie chcesz pokazać listę egzemplarzy bez osobnego zapytania o tytuł.
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { CreateBookCopyDto } from './dto/create-book-copy.dto.js';
import { UpdateBookCopyDto } from './dto/update-book-copy.dto.js';

export interface BookCopyRecord {
  id: string;
  book_id: string;
  inventory_number: string;
  status: string;
  condition: string | null;
  acquired_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface BookCopyWithTitle extends BookCopyRecord {
  book_title: string;
}

@Injectable()
export class BookCopiesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllByBookId(bookId: string): Promise<BookCopyWithTitle[]> {
    // JOIN: łączymy book_copies z books po book_id, żeby przy każdym
    // egzemplarzu mieć od razu tytuł (bc.* bierze wszystkie kolumny z book_copies,
    // a b.title dokładamy jako dodatkową kolumnę pod aliasem book_title).
    const result = await this.databaseService.query<BookCopyWithTitle>(
      `SELECT bc.*, b.title AS book_title
                                                                        FROM book_copies bc
                                                                                 JOIN books b ON b.id = bc.book_id
                                                                        WHERE bc.book_id = $1
                                                                        ORDER BY bc.acquired_at DESC`,
      [bookId],
    );
    return result.rows;
  }

  async create(
    bookId: string,
    dto: CreateBookCopyDto,
  ): Promise<BookCopyRecord> {
    const result = await this.databaseService.query<BookCopyRecord>(
      `INSERT INTO book_copies (book_id, inventory_number, condition, acquired_at)
                                                                     VALUES ($1, $2, $3,
                                                                             COALESCE($4, CURRENT_DATE)) RETURNING *`,
      [
        bookId,
        dto.inventoryNumber,
        dto.condition ?? null,
        dto.acquiredAt ?? null,
      ],
    );
    return result.rows[0];
  }

  async update(
    id: string,
    dto: UpdateBookCopyDto
  ): Promise<BookCopyRecord | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (dto.status !== undefined) {
      fields.push(`status = $${paramIndex}`);
      values.push(dto.status);
      paramIndex++;
    }
    if (dto.condition !== undefined) {
      fields.push(`condition = $${paramIndex}`);
      values.push(dto.condition);
      paramIndex++;
    }

    if (fields.length === 0) {
      //return this.findById(id);
    }

    fields.push(`updated_at = now()`);
    values.push(id);

    const result = await this.databaseService.query<BookCopyRecord>(
      `UPDATE book_copies
                                                                     SET ${fields.join(', ')}
                                                                     WHERE id = $${paramIndex} RETURNING *`,
      values,
    );
    return result.rows[0] ?? null;
  }

  async delete(id: string): Promise<any> {
    console.log(id, 'id');
    const result = await this.databaseService.query(
      `DELETE
                                                     FROM book_copies
                                                     WHERE id = $1`,
      [id],
    );

    return (result.rowCount ?? 0) > 0;
  }
}
