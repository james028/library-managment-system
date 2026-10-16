import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { MemberQueryDto } from './dto/member-query.dto.js';
import { PaginatedMembers } from './interfaces/paginated-members.interface.dto.js';
import { SqlQueryBuilder } from '../database/query-builder/sql-query-builder.js';

//import selectMembersSql from '../sql/select.members.sql';

export interface MemberDetails {
  id: number;
  //firstName: string;
  //lastName: string;
  //email: string;
  cardNumber: string;
  status: 'ACTIVE' | 'BLOCKED';
  //activeLoans: number;
  //activeReservations: number;
  //unpaidFinesAmount: string;
  createdAt: string;
  updatedAt: string;
}

// Mapa: pole z DTO -> bezpieczna kolumna SQL.
const MEMBER_SORT_COLUMNS = {
  createdAt: 'm.created_at',
  lastName: 'm.last_name',
  activeLoans: '"activeLoans"',
} as const;

@Injectable()
export class MembersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  // @ts-ignore
  async findMembers(query: MemberQueryDto): Promise<PaginatedMembers> {
    const filters = this.buildFilters(query);
    const { whereSql, values } = filters;

    console.log(whereSql, query, values);
    const offset = (query.page - 1) * query.size;

    //const sortColumn = MEMBER_SORT_COLUMNS[query.sortBy];

    const membersSql = `
        SELECT m.id,

               m.card_number AS "cardNumber",

               m.status,
               m.created_at,
               m.updated_at
        FROM members m
            ${whereSql}
    `;

    const membersResult = await this.databaseService.query(membersSql, values);

    // const selectMembersSql = readFileSync(
    //   join(__dirname, 'sql', 'select-members.sql'),
    //   'utf8',
    // )
    console.log(membersSql, values, membersResult.rows);

    return {
      // @ts-ignore
      items: membersResult.rows,
      page: 1,
      size: 2,
      totalItems: 3,
      totalPages: 1,
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

  private buildFilters(query: MemberQueryDto) {
    const queryBuilder = new SqlQueryBuilder();

    queryBuilder.addSearchFilter(
      ['m.first_name', 'm.last_name', 'm.card_number', 'm.email'],
      query.search,
    );

    console.log(query, 'query');

    queryBuilder.addFilter({
      column: 'm.status',
      operator: 'EQUAL',
      value: query.status,
    });

    return queryBuilder.build();
  }
}
