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
let ReservationsRepository = class ReservationsRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(params) {
        const result = await this.databaseService.query(`INSERT INTO reservations (book_id, user_id, expires_at)
                                                                        VALUES ($1, $2,
                                                                                $3) RETURNING *`, [params.bookId, params.userId, params.expiresAt]);
        return result.rows[0];
    }
    async findReservationsForUser(userId) {
        const results = await this.databaseService.query(`SELECT r.*, b.title AS book_title
       FROM reservations r
       JOIN books b ON b.id = r.book_id
       WHERE r.user_id = $1
       ORDER BY r.reserved_at DESC`, [userId]);
        return results.rows;
    }
    async findById(id) {
        const result = await this.databaseService.query(`SELECT * FROM reservations WHERE id = $1`, [id]);
        return result.rows[0] ?? null;
    }
    async updateStatus(id, newStatus) {
        const result = await this.databaseService.query(`UPDATE reservations SET status = $1
       WHERE id = $2 AND status = 'pending'
       RETURNING *`, [newStatus, id]);
        return result.rows[0] ?? null;
    }
};
ReservationsRepository = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseService])
], ReservationsRepository);
export { ReservationsRepository };
//# sourceMappingURL=reservations.repository.js.map