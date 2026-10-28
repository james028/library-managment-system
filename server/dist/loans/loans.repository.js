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
import { SqlQueryBuilder } from '../database/query-builder/sql-query-builder.js';
const LOAN_STATUS_SQL = `
  CASE
    WHEN l.returned_at IS NOT NULL THEN 'RETURNED'
    WHEN l.due_at < NOW() THEN 'OVERDUE'
    ELSE 'ACTIVE'
  END
`;
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
    async returnSummaryData() {
        const results = await this.databaseService.query(`
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
                  AND returned_at < CURRENT_DATE + INTERVAL '1 day' ) AS "returnedToday"
    `, []);
        return results.rows[0];
    }
    async returnAllLoans(query) {
        const queryBuilder = this.buildFilters(query);
        const { page, size } = query;
        queryBuilder.setPagination({
            page,
            size,
        });
        const { whereSql, values, paginationSql, paginationValues } = queryBuilder.buildPaginated();
        const loansSql = `
        SELECT jsonb_build_object(
                       'id', l.id,
                       'status', CASE
                                     WHEN l.returned_at IS NOT NULL THEN 'RETURNED'
                                     WHEN l.due_at < NOW() THEN 'OVERDUE'
                                     ELSE 'ACTIVE'
                           END,
                       'borrowedAt', l.borrowed_at,
                       'dueAt', l.due_at,
                       'returnedAt', l.returned_at,
                       'extendedCount', l.extended_count,
                       'isOverdue',
                       l.returned_at IS NULL
                           AND l.due_at < NOW(),
                       'daysOverdue', GREATEST(
                               CASE
                                   WHEN l.returned_at IS NOT NULL
                                       THEN EXTRACT(DAY FROM (l.returned_at - l.due_at))
                                   ELSE EXTRACT(DAY FROM (NOW() - l.due_at))
                                   END,
                               0
                                      ),
                       'bookCopy', jsonb_build_object(
                               'id', bc.id,
                               'inventory_number', bc.inventory_number,
                               'condition', bc.condition,
                               'book', jsonb_build_object(
                                       'id', b.id,
                                       'title', b.title,
                                       'author', b.author
                                       )
                                   ),
                       'member', jsonb_build_object(
                               'id', u.id,
                               'firstName', u.first_name,
                               'lastName', u.last_name,
                               'email', u.email,
                               'role', u.role
                                 )
               ) AS loan
        FROM loans l
                 INNER JOIN users u
                            ON u.id = l.user_id
                 INNER JOIN book_copies bc
                            ON bc.id = l.book_copy_id
                 INNER JOIN books b
                            ON b.id = bc.book_id
            ${whereSql} ${paginationSql}
    `;
        const loansResult = await this.databaseService.query(loansSql, [...values, ...paginationValues]);
        console.log(loansResult);
        const countSql = `
        SELECT COUNT(*) AS "totalItems"
        FROM loans l
                 INNER JOIN users u
                            ON u.id = l.user_id
                 INNER JOIN book_copies bc
                            ON bc.id = l.book_copy_id
                 INNER JOIN books b
                            ON b.id = bc.book_id
            ${whereSql};`;
        const countResult = await this.databaseService.query(countSql, values);
        const totalItems = Number(countResult.rows[0].totalItems);
        const totalPages = Math.ceil(totalItems / query.size);
        return {
            items: loansResult.rows,
            page,
            size,
            totalItems,
            totalPages,
        };
    }
    buildFilters(query) {
        const queryBuilder = new SqlQueryBuilder();
        const { search, status, memberId, bookId, bookCopyId, borrowedFrom, borrowedTo, dueFrom, dueTo, returnedFrom, returnedTo, overdue, active, } = query;
        if (search) {
            queryBuilder.addSearchFilter([
                'b.title',
                'b.author',
                'u.email',
                "concat_ws(' ', u.first_name, u.last_name)",
            ], search);
        }
        if (status) {
            queryBuilder.addFilter({
                column: LOAN_STATUS_SQL,
                operator: 'EQUAL',
                value: status,
            });
        }
        if (memberId) {
            queryBuilder.addFilter({
                column: 'l.user_id',
                operator: 'EQUAL',
                value: memberId,
            });
        }
        if (bookCopyId) {
            queryBuilder.addFilter({
                column: 'l.book_copy_id',
                operator: 'EQUAL',
                value: bookCopyId,
            });
        }
        if (bookId) {
            queryBuilder.addFilter({
                column: 'bc.book_id',
                operator: 'EQUAL',
                value: bookId,
            });
        }
        const dateRanges = [
            { column: 'l.borrowed_at', from: borrowedFrom, to: borrowedTo },
            {
                column: 'l.due_at',
                from: dueFrom,
                to: dueTo,
            },
            { column: 'l.returned_at', from: returnedFrom, to: returnedTo },
        ];
        const endOfDay = (date) => {
            const result = new Date(`${date}T00:00:00Z`);
            result.setUTCHours(23, 59, 59, 999);
            return result.toISOString();
        };
        for (const { column, from, to } of dateRanges) {
            if (from) {
                queryBuilder.addFilter({
                    column,
                    operator: 'GREATER_THAN_OR_EQUAL',
                    value: from,
                });
            }
            if (to) {
                queryBuilder.addFilter({
                    column,
                    operator: 'LESS_THAN_OR_EQUAL',
                    value: endOfDay(to),
                });
            }
        }
        if (active) {
            queryBuilder.addFilter({
                column: 'l.returned_at IS NULL',
                operator: 'EXISTS',
                value: active,
            });
        }
        if (overdue) {
            queryBuilder.addFilter({
                column: 'l.returned_at IS NULL AND l.due_at < NOW()',
                operator: 'EXISTS',
                value: overdue,
            });
        }
        return queryBuilder;
    }
};
LoansRepository = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseService])
], LoansRepository);
export { LoansRepository };
//# sourceMappingURL=loans.repository.js.map