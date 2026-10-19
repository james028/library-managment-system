import { QueryFilter } from './query-builder.interface.js';

export interface BuiltQuery {
  whereSql: string;
  values: unknown[];
}

export interface PaginatedQuery extends BuiltQuery {
  paginationSql: string;
  paginationValues: unknown[];
}

export interface Pagination {
  page: number;
  size: number;
}

const OPERATOR_SQL = {
  EQUAL: '=',
  NOT_EQUAL: '<>',
  LIKE: 'LIKE',
  ILIKE: 'ILIKE',
  GREATER_THAN_OR_EQUAL: '>=',
  LESS_THAN_OR_EQUAL: '<=',
} as const;

export class SqlQueryBuilder {
  limit?: number;
  offset?: number;
  private conditions: string[] = [];
  private values: unknown[] = [];

  addFilter(filter: QueryFilter) {
    if (filter.value === undefined || filter.value === null) {
      return this;
    }

    const parameterIndex = this.values.length + 1;

    if (filter.operator === 'EXISTS') {
      this.conditions.push(filter.column);
      this.values.push(filter.value);
    }

    // @ts-ignore
    const operatorSql = OPERATOR_SQL[filter.operator];

    this.conditions.push(`${filter.column} ${operatorSql} $${parameterIndex}`);
    this.values.push(filter.value);

    return this;
  }

  addSearchFilter(columns: string[], value?: string): this {
    const normalizedValue = value?.trim();

    if (!normalizedValue) {
      return this;
    }

    const parameterIndex = this.values.length + 1;

    const searchConditions = columns.map(
      (column) => `${column} ILIKE '%' || $${parameterIndex} || '%'`,
    );
    this.conditions.push(`(${searchConditions.join(' OR ')})`);

    this.values.push(normalizedValue);

    return this;
  }

  setPagination({ page, size }: Pagination) {
    this.offset = (page - 1) * size;
    this.limit = size;

    return this;
  }

  buildPaginated(): PaginatedQuery {
    const whereSql = this.conditions.length
      ? `WHERE ${this.conditions.join(' AND ')}`
      : '';

    return {
      whereSql,
      values: this.values,
      paginationSql: `LIMIT $${this.values.length + 1} OFFSET $${this.values.length + 2}`,
      paginationValues: [this.limit, this.offset],
    };
  }
}
