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
    async returnLoan(id, fineRatePerDay) {
        const client = await this.databaseService.getClient();
        try {
            client.query('BEGIN');
            const loanUpdate = await client.query(`UPDATE loans
                                                         SET returned_at = now()
                                                         WHERE id = $1
                                                           AND returned_at IS NULL RETURNING *`, [id]);
            if (loanUpdate.rowCount === 0) {
                await client.query('ROLLBACK');
                return null;
            }
            const loan = loanUpdate.rows[0];
            await client.query(`UPDATE book_copies
                          SET status     = 'available',
                              updated_at = now()
                          WHERE id = $1`, [loan.book_copy_id]);
            const msOverdue = Date.now() - new Date(loan.due_at).getTime();
            const daysOverdue = Math.floor(msOverdue / (24 * 60 * 60 * 1000));
            let fineAmount = null;
            if (daysOverdue > 0) {
                fineAmount = Math.round(daysOverdue * fineRatePerDay * 100) / 100;
                await client.query('INSERT INTO fines (loan_id, amount) VALUES ($1, $2, $3)', [loan.id, fineAmount]);
            }
            await client.query('COMMIT');
            return loan;
        }
        catch (error) {
            client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async findAllForUser(userId) {
        const result = await this.databaseService.query(`SELECT l.*, b.title AS book_title, bc.inventory_number
                                                                      FROM loans l
                                                                               JOIN book_copies bc ON bc.id = l.book_copy_id
                                                                               JOIN books b ON b.id = bc.book_id
                                                                      WHERE l.user_id = $1
                                                                      ORDER BY l.borrowed_at DESC`, [userId]);
        return result.rows;
    }
};
LoansRepository = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseService])
], LoansRepository);
export { LoansRepository };
//# sourceMappingURL=loans.repository.js.map