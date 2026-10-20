export type QueryFilterOperator =
  | 'EQUAL'
  | 'NOT_EQUAL'
  | 'LIKE'
  | 'ILIKE'
  | 'GREATER_THAN_OR_EQUAL'
  | 'LESS_THAN_OR_EQUAL'
  | 'EXISTS';

export type QueryFilter =
  | {
  column: string;
  operator: QueryFilterOperator;
  value: unknown;
}
  | {
  column: string;
  operator: 'EXISTS';
  value: boolean;
};

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