import { LoanRecord, LoansRepository } from './loans.repository.js';
import { CreateLoanDto } from './dto/create.loan.dto.js';
export declare class LoansService {
    private readonly loansRepository;
    constructor(loansRepository: LoansRepository);
    borrow(dto: CreateLoanDto): Promise<LoanRecord | null>;
}
