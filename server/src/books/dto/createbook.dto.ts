import { IsString, IsOptional, IsInt, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    example: 'Clean Code',
    description: 'Book title',
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'Andrzej Sapkowski',
    description: 'Book author',
  })
  @IsString()
  @MaxLength(255)
  author: string;

  @ApiPropertyOptional({
    example: '9780132350884',
    description: 'ISBN number',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  isbn?: string;

  @ApiPropertyOptional({
    example: 'Prentice Hall',
    description: 'Publisher name',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  publisher?: string;

  @ApiPropertyOptional({
    example: 2008,
    description: 'Publication year',
  })
  @IsOptional()
  @IsInt()
  @Min(1400)
  @Max(new Date().getFullYear())
  publishedYear?: number;

  @ApiPropertyOptional({
    example: 'A handbook of agile software craftsmanship.',
    description: 'Book description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}