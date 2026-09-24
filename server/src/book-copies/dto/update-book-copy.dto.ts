import { IsOptional, IsString, MaxLength, IsIn } from 'class-validator';

const STATUSES = ['available', 'checked_out', 'reserved', 'lost', 'under_repair'] as const;

export class UpdateBookCopyDto {
  @IsOptional()
  @IsIn(STATUSES, { message: `status musi być jednym z: ${STATUSES.join(', ')}` })
  status?: (typeof STATUSES)[number];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  condition?: string;
}
