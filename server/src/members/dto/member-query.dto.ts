import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsIn,
  IsInt,
  Min,
  Max,
  IsDateString, IsBoolean,
} from 'class-validator';

export class MemberQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['ACTIVE', 'BLOCKED'])
  status?: 'ACTIVE' | 'BLOCKED';

  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  hasActiveLoans?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  hasOverdueLoans?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  hasUnpaidFines?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size: number = 20;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'DESC';


  @IsOptional()
  @IsIn(['createdAt', 'lastName'])
  sortBy: 'createdAt' | 'lastName' = 'createdAt';
}