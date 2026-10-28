import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QueryLoanDto {
  @IsOptional() @IsString() search?: string;

  @IsOptional() @IsIn(['ACTIVE', 'OVERDUE', 'RETURNED']) status?:
    'ACTIVE' | 'OVERDUE' | 'RETURNED';

  @IsOptional() @Type(() => String) @IsInt() @Min(1) memberId?: string;
  @IsOptional() @Type(() => String) @IsInt() @Min(1) bookId?: string;
  @IsOptional() @Type(() => String) @IsInt() @Min(1) bookCopyId?: string;

  @IsOptional() @IsDateString() borrowedFrom?: string;
  @IsOptional() @IsDateString() borrowedTo?: string;
  @IsOptional() @IsDateString() dueFrom?: string;
  @IsOptional() @IsDateString() dueTo?: string;
  @IsOptional() @IsDateString() returnedFrom?: string;
  @IsOptional() @IsDateString() returnedTo?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  overdue?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  active?: boolean;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) size: number =
    20;

  @IsOptional() @IsIn(['ASC', 'DESC']) sortOrder: 'ASC' | 'DESC' = 'DESC';

  @IsOptional() @IsIn(['borrowedFrom', 'borrowedTo']) sortBy:
    'borrowedFrom' | 'borrowedTo' = 'borrowedFrom';
}
