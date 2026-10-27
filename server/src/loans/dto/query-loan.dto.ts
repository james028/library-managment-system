import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsIn,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

export class QueryLoanDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['ACTIVE', 'OVERDUE', 'RETURNED'])
  status?: 'ACTIVE' | 'OVERDUE' | 'RETURNED';

  @IsOptional()
  @IsDateString()
  borrowedFrom?: string;

  @IsOptional()
  @IsDateString()
  borrowedTo?: string;

  @IsOptional()
  @IsDateString()
  returnedFrom?: string;

  @IsOptional()
  @IsDateString()
  returnedTo?: string;

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
  @IsIn(['borrowedFrom', 'borrowedTo'])
  sortBy: 'borrowedFrom' | 'borrowedTo' = 'borrowedFrom';
}

// export interface LoanFilters {
//   search?: string;
//   status?: LoanStatus;
//   memberId?: number;
//   bookId?: number;
//   bookCopyId?: number;
//   borrowedFrom?: string;
//   borrowedTo?: string;
//   dueFrom?: string;
//   dueTo?: string;
//   returnedFrom?: string;
//   returnedTo?: string;
//   overdue?: boolean;
//   active?: boolean;
// }