import { IsString, IsOptional, IsInt, Min, Max, MaxLength } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(255)
  author: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  isbn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  publisher?: string;

  @IsOptional()
  @IsInt()
  @Min(1400)
  @Max(new Date().getFullYear())
  publishedYear?: number;

  @IsOptional()
  @IsString()
  description?: string;
}