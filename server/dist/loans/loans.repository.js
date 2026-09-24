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
let LoansRepository = class LoansRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async borrow(params) {
        const client = await this.databaseService.getClient();
        try {
            client.query('BEGIN');
            const copyUpdate = await client.query(`UPDATE book_copies
                                             SET status     = 'checked_out',
                                                 updated_at = now()
                                             WHERE id = $1
                                               AND status = 'available' RETURNING id`, [params.bookCopyId]);
            if (copyUpdate.rowCount === 0) {
                await client.query('ROLLBACK');
                return null;
            }
            const loanInsert = await client.query(`INSERT INTO loans (book_copy_id, user_id, due_at)
                                                         VALUES ($1, $2,
                                                                 $3) RETURNING *`, [params.bookCopyId, params.userId, params.dueAt]);
            await client.query('COMMIT');
            return loanInsert.rows[0];
        }
        catch (error) {
            client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async findById(id) {
        const result = await this.databaseService.query(`SELECT *
                                                                 FROM loans
                                                                 WHERE id = $1`, [id]);
        return result.rows[0] ?? null;
    }
};
LoansRepository = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseService])
], LoansRepository);
export { LoansRepository };
//# sourceMappingURL=loans.repository.js.map