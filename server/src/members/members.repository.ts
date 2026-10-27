import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { QueryMemberDto } from './dto/query-member.dto.js';
import { PaginatedMembers } from './interfaces/paginated-members.interface.dto.js';
import { SqlQueryBuilder } from '../database/query-builder/sql-query-builder.js';
import { Member, MemberDetails } from './interfaces/members.interface.dto.js';
import { EXISTS_SQL, MEMBER_SORT_COLUMNS } from './members.query.config.js';

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
               m.created_at AS "createdAt",
               m.updated_at AS "updatedAt",
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

  async createMember(
    userId: string,
    cardNumber: string,
  ): Promise<MemberDetails> {
    const result = await this.databaseService.query<MemberDetails>(
      `INSERT INTO members (user_id,
                                                                                         card_number)
                                                                    VALUES ($1,
                                                                            $2)
                                                                    RETURNING
                                                                        id,
                                                                        user_id AS "userId",
                                                                        card_number AS "cardNumber",
                                                                        status,
                                                                        created_at AS "createdAt",
                                                                        updated_at AS "updatedAt";`,
      [userId, cardNumber],
    );

    return result.rows[0];
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
      hasActiveLoans
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
}
