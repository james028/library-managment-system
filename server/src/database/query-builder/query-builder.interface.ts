export type QueryFilterOperator =
  | 'EQUAL'
  | 'NOT_EQUAL'
  | 'LIKE'
  | 'ILIKE'
  | 'GREATER_THAN_OR_EQUAL'
  | 'LESS_THAN_OR_EQUAL'
  | 'EXISTS';

export interface QueryFilter {
  column: string;
  operator:
    | 'EQUAL'
    | 'NOT_EQUAL'
    | 'LIKE'
    | 'ILIKE'
    | 'GREATER_THAN_OR_EQUAL'
    | 'LESS_THAN_OR_EQUAL'
    | 'EXISTS';

  value?: unknown;
}