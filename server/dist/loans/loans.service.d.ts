import { LoanRecord, LoansRepository } from './loans.repository.js';
import { CreateLoanDto } from './dto/create.loan.dto.js';
import { QueryLoanDto } from './dto/query-loan.dto.js';
import { SettingsService } from '../settings/settings.service.js';
export declare class LoansService {
    private readonly loansRepository;
    private readonly settingsService;
    constructor(loansRepository: LoansRepository, settingsService: SettingsService);
    borrow(dto: CreateLoanDto): Promise<LoanRecord | null>;
    returnLoan(id: string): Promise<LoanRecord>;
    findMyLoans(userId: string): Promise<import("./loans.repository.js").LoanWithDetails[]>;
    returnSummary(): Promise<import("./loans.repository.js").LoansSummary>;
    getAllLoans(query: QueryLoanDto): Promise<any>;
    private normalizeQuery;
}
