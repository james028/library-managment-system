var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
let BookCopiesRepository = class BookCopiesRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async findAllByBookId(bookId) {
        const result = await this.databaseService.query(`SELECT bc.*, b.title AS book_title
                                                                        FROM book_copies bc
                                                                                 JOIN books b ON b.id = bc.book_id
                                                                        WHERE bc.book_id = $1
                                                                        ORDER BY bc.acquired_at DESC`, [bookId]);
        return result.rows;
    }
    async create(bookId, dto) {
        const result = await this.databaseService.query(`INSERT INTO book_copies (book_id, inventory_number, condition, acquired_at)
                                                                     VALUES ($1, $2, $3,
                                                                             COALESCE($4, CURRENT_DATE)) RETURNING *`, [
            bookId,
            dto.inventoryNumber,
            dto.condition ?? null,
            dto.acquiredAt ?? null,
        ]);
        return result.rows[0];
    }
    async update(id, dto) {
        const fields = [];
        const values = [];
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
        }
        fields.push(`updated_at = now()`);
        values.push(id);
        const result = await this.databaseService.query(`UPDATE book_copies
                                                                     SET ${fields.join(', ')}
                                                                     WHERE id = $${paramIndex} RETURNING *`, values);
        return result.rows[0] ?? null;
    }
    async delete(id) {
        console.log(id, 'id');
        const result = await this.databaseService.query(`DELETE
                                                     FROM book_copies
                                                     WHERE id = $1`, [id]);
        return (result.rowCount ?? 0) > 0;
    }
};
BookCopiesRepository = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseService])
], BookCopiesRepository);
export { BookCopiesRepository };
//# sourceMappingURL=book-copies.repository.js.map