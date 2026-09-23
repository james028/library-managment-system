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
let BooksRepository = class BooksRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async findAllBooks(params) {
        const { limit, offset, search } = params;
        const whereClause = search ? `WHERE title ILIKE $3 OR author ILIKE $3` : '';
        const values = search
            ? [limit, offset, `%${search}%`]
            : [limit, offset];
        const dataResult = await this.databaseService.query(`SELECT * FROM books ${whereClause}
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`, values);
        const countResult = await this.databaseService.query(`SELECT COUNT(*) FROM books ${whereClause}`, search ? [`%${search}%`] : []);
        return {
            items: dataResult.rows,
            total: parseInt(countResult.rows[0].count, 10),
        };
    }
    async findById(id) {
        const result = await this.databaseService.query(`SELECT * FROM books WHERE id = $1`, [id]);
        return result.rows[0] ?? null;
    }
    async delete(id) {
        const result = await this.databaseService.query(`DELETE FROM books WHERE id = $1`, [id]);
        return (result.rowCount ?? 0) > 0;
    }
};
BooksRepository = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseService])
], BooksRepository);
export { BooksRepository };
//# sourceMappingURL=books.repository.js.map