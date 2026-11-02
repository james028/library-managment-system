import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { QueryMemberDto } from './dto/query-member.dto.js';
import { PaginatedMembers } from './interfaces/paginated-members.interface.dto.js';
import { SqlQueryBuilder } from '../database/query-builder/sql-query-builder.js';
import { Member, MemberDetails } from './interfaces/members.interface.dto.js';
import { EXISTS_SQL, MEMBER_SORT_COLUMNS } from './members.query.config.js';
import { createHash } from 'node:crypto';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MembersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findMembers(query: QueryMemberDto): Promise<PaginatedMembers> {
    const queryBuilder = this.buildFilters(query);
    const { page, size } = query;

    queryBuilder.setPagination({
      page,
      size,
    });
    const { whereSql, values, paginationSql, paginationValues } =
      queryBuilder.buildPaginated();

    const sortColumn = MEMBER_SORT_COLUMNS[query.sortBy];

    const membersSql = `
        SELECT m.id,
               u.first_name                  AS "firstName",
               u.last_name                   AS "lastName",
               u.email,
               m.card_number                 AS "cardNumber",
               m.status,
               m.created_at                  AS "createdAt",
               m.updated_at                  AS "updatedAt",
               (SELECT COUNT(*)::int
                FROM loans l
                WHERE l.user_id = m.user_id
                  AND l.returned_at IS NULL) AS "activeLoans",
               (SELECT COALESCE(SUM(f.amount), 0)
                FROM fines f
                         INNER JOIN loans l ON l.id = f.loan_id
                WHERE l.user_id = m.user_id
                  AND f.paid = false)        AS "totalUnpaidFinesAmount"
        FROM members m
                 INNER JOIN users u ON u.id = m.user_id
            ${whereSql}
        ORDER BY ${sortColumn} ${query.sortOrder} NULLS LAST, m.id ASC
            ${paginationSql}
    `;

    console.log(membersSql);

    const membersResult = await this.databaseService.query<Member>(membersSql, [
      ...values,
      ...paginationValues,
    ]);

    const countSql = `
        SELECT COUNT(*) AS "totalItems"
        FROM members m
                 INNER JOIN users u ON u.id = m.user_id
            ${whereSql};
    `;

    const countResult = await this.databaseService.query<{
      totalItems: number;
    }>(countSql, values);

    const totalItems = Number(countResult.rows[0].totalItems);
    const totalPages = Math.ceil(totalItems / query.size);

    return {
      items: membersResult.rows,
      page,
      size,
      totalItems,
      totalPages,
    };
  }

  async findMemberByUserId(userId: string): Promise<MemberDetails | null> {
    const result = await this.databaseService.query<MemberDetails>(
      `SELECT id,
                                                                           user_id     AS "userId",
                                                                           card_number AS "cardNumber",
                                                                           status,
                                                                           created_at  AS "createdAt",
                                                                           updated_at  AS "updatedAt"
                                                                    FROM members
                                                                    WHERE user_id = $1;`,
      [userId],
    );

    return result.rows[0] ?? null;
  }

  async createMemberWithInvitation(member: any) {
    const client = await this.databaseService.getClient();

    try {
      await client.query('BEGIN');

      console.log(member, 'member');
      const { firstName, lastName, email, cardNumber } = member;

      const temporaryPassword = randomBytes(32).toString('hex');

      const passwordHash = await bcrypt.hash(temporaryPassword, 10);

      const userResult = await client.query(
        `
          INSERT INTO users (first_name, last_name, email, password_hash, role, is_active)
          VALUES ($1, $2, $3, $4, 'member', false)
          RETURNING id
      `,
        [firstName, lastName, email, passwordHash],
      );

      const userId = userResult.rows[0].id;

      await client.query(
        `
          INSERT INTO members (user_id, card_number, status)
          VALUES ($1, $2, 'ACTIVE')
      `,
        [userId, cardNumber],
      );

      const invitation = this.generateInvitationToken();

      await client.query(
        `
          INSERT INTO user_invitations (user_id,
                                        token_hash,
                                        expires_at)
          VALUES ($1, $2, $3)
      `,
        [userId, invitation.tokenHash, invitation.expiresAt],
      );

      await client.query('COMMIT');
      return userResult;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findMemberByCardNumber(
    cardNumber: string, //poprawic any
  ): Promise<any | null> {
    const result = await this.databaseService.query(
      `
        SELECT id,
               user_id,
               card_number,
               status,
               created_at
        FROM members
        WHERE card_number = $1
        LIMIT 1
    `,
      [cardNumber],
    );

    return result.rows[0] ?? null;
  }

  private buildFilters(query: QueryMemberDto) {
    const queryBuilder = new SqlQueryBuilder();
    const {
      search,
      status,
      createdFrom,
      createdTo,
      hasOverdueLoans,
      hasUnpaidFines,
      hasActiveLoans,
    } = query;

    if (search) {
      queryBuilder.addSearchFilter(
        ['u.first_name', 'u.last_name', 'm.card_number', 'u.email'],
        search,
      );
    }

    if (status) {
      queryBuilder.addFilter({
        column: 'm.status',
        operator: 'EQUAL',
        value: query.status,
      });
    }

    if (createdFrom) {
      queryBuilder.addFilter({
        column: 'm.created_at::DATE',
        operator: 'GREATER_THAN_OR_EQUAL',
        value: createdFrom,
      });
    }

    if (createdTo) {
      queryBuilder.addFilter({
        column: 'm.created_at::DATE',
        operator: 'LESS_THAN_OR_EQUAL',
        value: createdTo,
      });
    }

    if (hasOverdueLoans === true) {
      queryBuilder.addFilter({
        column: EXISTS_SQL.hasOverdueLoans,
        operator: 'EXISTS',
        value: true,
      });
    }

    if (hasUnpaidFines === true) {
      queryBuilder.addFilter({
        column: EXISTS_SQL.hasUnpaidFines,
        operator: 'EXISTS',
        value: true,
      });
    }

    if (hasActiveLoans === true) {
      queryBuilder.addFilter({
        column: EXISTS_SQL.hasActiveLoans,
        operator: 'EXISTS',
        value: true,
      });
    }

    return queryBuilder;
  }

  private generateInvitationToken(): {
    token: string;
    tokenHash: string;
    expiresAt: Date;
  } {
    const token = randomBytes(32).toString('hex');

    const tokenHash = createHash('sha256').update(token).digest('hex');

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return {
      token,
      tokenHash,
      expiresAt,
    };
  }
}
