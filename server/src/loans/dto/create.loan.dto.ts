import { IsUUID, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLoanDto {
  @ApiProperty({
    example: 'ca994797-88a1-4bb2-b497-d035c3bb3d61',
    description: 'UUID of the book copy to borrow',
  })
  @IsUUID()
  bookCopyId: string;

  @ApiProperty({
    example: '1b5c7860-de7a-47fa-a01d-05df92862e69',
  })
  @IsUUID()
  userId: string; // librarian wskazuje, dla kogo rejestruje wypożyczenie

  @ApiPropertyOptional({
    example: '2026-10-01T23:59:59.000Z',
    description: 'Date and time when the book should be returned',
  })
  @IsOptional()
  @IsDateString()
  dueAt?: string; // jeśli nie podane, service ustawi domyślnie +14 dni
}