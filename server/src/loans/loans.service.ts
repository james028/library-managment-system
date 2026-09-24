import { ConflictException, Injectable } from '@nestjs/common';
import { LoanRecord, LoansRepository } from './loans.repository.js';
import { CreateLoanDto } from './dto/create.loan.dto.js';

const DEFAULT_LOAN_DAYS = 14;

@Injectable()
export class LoansService {
  constructor(private readonly loansRepository: LoansRepository) {
  }

  async borrow(dto: CreateLoanDto): Promise<LoanRecord | null> {
    const dueAt = dto.dueAt
      ? new Date(dto.dueAt)
      : new Date(Date.now() + DEFAULT_LOAN_DAYS * 24 * 60 * 60 * 1000);

    const loan = await this.loansRepository.borrow({
      bookCopyId: dto.bookCopyId,
      userId: dto.userId,
      dueAt,
    });

    if (!loan) {
      // Repozytorium zwraca null zarówno gdy egzemplarz nie istnieje, jak i gdy jest zajęty —
      // z punktu widzenia klienta API to i tak ten sam komunikat: "nie da się teraz wypożyczyć".
      throw new ConflictException(
        'Egzemplarz jest niedostępny do wypożyczenia (nie istnieje albo jest już wypożyczony)',
      );
    }

    return loan;
  }
}
