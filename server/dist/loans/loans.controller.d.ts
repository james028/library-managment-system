import { LoansService } from './loans.service.js';
import { CreateLoanDto } from './dto/create.loan.dto.js';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';
export declare class LoansController {
    private readonly loansService;
    constructor(loansService: LoansService);
    findMyLoans(user: CurrentUserPayload): Promise<import("./loans.repository.js").LoanWithDetails[]>;
    borrow(dto: CreateLoanDto): Promise<import("./loans.repository.js").LoanRecord | null>;
    returnLoan(id: string): Promise<import("./loans.repository.js").LoanRecord>;
}
