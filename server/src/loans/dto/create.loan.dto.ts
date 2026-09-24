import { IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreateLoanDto {
  @IsUUID()
  bookCopyId: string;

  @IsUUID()
  userId: string; // librarian wskazuje, dla kogo rejestruje wypożyczenie

  @IsOptional()
  @IsDateString()
  dueAt?: string; // jeśli nie podane, service ustawi domyślnie +14 dni
}