import { validate } from 'class-validator';
import { QueryMemberDto } from './query-member.dto.js';
import { plainToInstance } from 'class-transformer';

const createDto = (data: Partial<QueryMemberDto> = {}) => {
  const dto = new QueryMemberDto();

  Object.assign(dto, data);

  return dto;
};

describe('QueryMemberDto', () => {
  it('should apply default values when query is empty', async () => {
    const dto = new QueryMemberDto();

    const errors = await validate(dto);

    expect(dto.page).toBe(1);
    expect(dto.size).toBe(20);
    expect(dto.sortBy).toBe('createdAt');
    expect(dto.sortOrder).toBe('DESC');
    expect(errors).toHaveLength(0);
  });

  it('should reject an unsupported status', async () => {
    const dto = createDto({
      status: 'DELETED' as never,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('status');
  });

  it('should reject page below 1', async () => {
    const dto = createDto({
      page: 0,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('page');
  });

  it('should reject an unsupported sort field', async () => {
    const dto = createDto({
      sortBy: 'password' as never,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('sortBy');
  });

  it.each([
    { input: 'true', expected: true },
    { input: 'false', expected: false },
    {
      input: true,
      expected: true,
    },
    { input: false, expected: false },
  ])(
    'should transform hasActiveLoans "$input" to $expected',
    ({ input, expected }) => {
      const dto = plainToInstance(QueryMemberDto, {
        hasActiveLoans: input,
      });

      expect(dto.hasActiveLoans).toBe(expected);
    },
  );

  it('should reject size above 100', async () => {
    const dto = createDto({
      size: 101,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('size');
  });
});
