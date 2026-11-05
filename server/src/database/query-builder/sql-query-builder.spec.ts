import { SqlQueryBuilder } from './sql-query-builder.js';

describe('SqlQueryBuilder', () => {
  it('should return empty where clause when no filters are added', () => {
    const builder = new SqlQueryBuilder();

    const result = builder.buildPaginated();

    expect(result.whereSql).toBe('');
    expect(result.values).toEqual([]);
  });

  it('should build WHERE clause for one EQUAL filter', () => {
    const builder = new SqlQueryBuilder();

    builder.addFilter({
      column: 'm.status',
      operator: 'EQUAL',
      value: 'ACTIVE',
    });

    const result = builder.buildPaginated();

    expect(result.whereSql).toBe('WHERE m.status = $1');
    expect(result.values).toEqual(['ACTIVE']);
  });

  it('should number parameters sequentially for multiple filters', () => {
    const builder = new SqlQueryBuilder();

    builder.addFilter({
      column: 'm.status',
      operator: 'EQUAL',
      value: 'ACTIVE',
    });

    builder.addFilter({
      column: 'm.created_at::DATE',
      operator: 'LESS_THAN_OR_EQUAL',
      value: '2026-10-18',
    });

    const result = builder.buildPaginated();

    expect(result.whereSql).toBe(
      'WHERE m.status = $1 AND m.created_at::DATE <= $2',
    );
    expect(result.values).toEqual(['ACTIVE', '2026-10-18']);
  });

  it('should use offset 0 for the first page', () => {
    const builder = new SqlQueryBuilder();

    builder.setPagination({ page: 1, size: 5 });

    const result = builder.buildPaginated();

    expect(result.paginationValues).toEqual([5, 0]);
  });

  it('should skip one full page for the second page', () => {
    const builder = new SqlQueryBuilder();

    builder.setPagination({ page: 2, size: 5 });

    const result = builder.buildPaginated();

    expect(result.paginationValues).toEqual([5, 5]);
  });

  it('should number pagination parameters after filter values', () => {
    const builder = new SqlQueryBuilder();

    builder.addFilter({
      column: 'm.status',
      operator: 'EQUAL',
      value: 'ACTIVE',
    });

    builder.setPagination({ page: 1, size: 5 });

    const result = builder.buildPaginated();

    expect(result.values).toEqual(['ACTIVE']);
    expect(result.paginationSql).toContain('LIMIT $2');
    expect(result.paginationSql).toContain('OFFSET $3');
    expect(result.paginationValues).toEqual([5, 0]);
  });

  it('should add EXISTS condition without adding a parameter', () => {
    const builder = new SqlQueryBuilder();

    builder.addFilter({
      column: 'EXISTS (SELECT 1 FROM loans l WHERE l.member_id = m.id)',
      operator: 'EXISTS',
      value: true,
    });

    const result = builder.buildPaginated();

    expect(result.whereSql).toBe(
      'WHERE EXISTS (SELECT 1 FROM loans l WHERE l.member_id = m.id)',
    );
    expect(result.values).toEqual([]);
  });

  it('should ignore EXISTS filter when value is false', () => {
    const builder = new SqlQueryBuilder();

    builder.addFilter({
      column: 'EXISTS (SELECT 1 FROM loans l WHERE l.member_id = m.id)',
      operator: 'EXISTS',
      value: false,
    });

    const result = builder.buildPaginated();

    expect(result.whereSql).toBe('');
    expect(result.values).toEqual([]);
  });

  it('should not consume a parameter slot for EXISTS filter', () => {
    const builder = new SqlQueryBuilder();

    builder.addFilter({
      column: 'EXISTS (SELECT 1 FROM loans l WHERE l.member_id = m.id)',
      operator: 'EXISTS',
      value: true,
    });

    builder.addFilter({
      column: 'm.status',
      operator: 'EQUAL',
      value: 'ACTIVE',
    });

    const result = builder.buildPaginated();

    expect(result.whereSql).toBe(
      'WHERE EXISTS (SELECT 1 FROM loans l WHERE l.member_id = m.id) AND m.status = $1',
    );
    expect(result.values).toEqual(['ACTIVE']);
  });

  it('should build search filter across multiple columns', () => {
    const builder = new SqlQueryBuilder();

    builder.addSearchFilter(['u.first_name', 'u.last_name'], 'jan');

    const result = builder.buildPaginated();

    expect(result.whereSql).toBe(
      "WHERE (u.first_name ILIKE '%' || $1 || '%' OR u.last_name ILIKE '%' || $1 || '%')",
    );
    expect(result.values).toEqual(['jan']);
  });

  it('should ignore empty search value', () => {
    const builder = new SqlQueryBuilder();

    builder.addSearchFilter(['u.first_name'], '   ');

    const result = builder.buildPaginated();

    expect(result.whereSql).toBe('');
    expect(result.values).toEqual([]);
  });

  it('should skip filter when value is undefined', () => {
    const builder = new SqlQueryBuilder();

    builder.addFilter({
      column: 'm.status',
      operator: 'EQUAL',
      value: undefined,
    });

    const result = builder.buildPaginated();

    expect(result.whereSql).toBe('');
    expect(result.values).toEqual([]);
  });
});
