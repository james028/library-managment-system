import { IsString, IsOptional, MaxLength, IsDateString } from 'class-validator';

export class CreateBookCopyDto {
  @IsString()
  @MaxLength(50)
  inventoryNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  condition?: string;

  @IsOptional()
  @IsDateString()
  acquiredAt?: string;
}