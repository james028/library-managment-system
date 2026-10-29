import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoanRecord, LoansRepository } from './loans.repository.js';
import { CreateLoanDto } from './dto/create.loan.dto.js';
import { QueryLoanDto } from './dto/query-loan.dto.js';
import { SettingsService } from '../settings/settings.service.js';

//zrobić z bazy. juz jest
const DEFAULT_LOAN_DAYS = 14;
const MIN_SEARCH_LENGTH = 2;

@Injectable()
export class LoansService {
  constructor(
    private readonly loansRepository: LoansRepository,
    private readonly settingsService: SettingsService,
  ) {}

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

  async returnLoan(id: string) {
    const fineRatePerDay = await this.settingsService.getFineRatePerDay();
    const loan = await this.loansRepository.returnLoan(id, fineRatePerDay);

    if (!loan) {
      throw new NotFoundException(
        'Wypożyczenie nie istnieje albo zostało już wcześniej zwrócone',
      );
    }

    return loan;
  }

  findMyLoans(userId: string) {
    return this.loansRepository.findAllForUser(userId);
  }

  returnSummary() {
    return this.loansRepository.returnSummaryData();
  }

  getAllLoans(query: QueryLoanDto) {
    const normalizedQuery = this.normalizeQuery(query);
    return this.loansRepository.returnAllLoans(normalizedQuery);
  }

  private normalizeQuery(query: QueryLoanDto): QueryLoanDto {
    const search = query.search?.trim();

    if (
      search !== undefined &&
      search.length > 0 &&
      search.length < MIN_SEARCH_LENGTH
    ) {
      throw new BadRequestException(
        `Search phrase must contain at least ${MIN_SEARCH_LENGTH} characters.`,
      );
    }

    return {
      ...query,
      search: search || undefined,
    };
  }
}
