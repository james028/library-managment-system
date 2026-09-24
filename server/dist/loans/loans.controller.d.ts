import { LoansService } from './loans.service.js';
import { CreateLoanDto } from './dto/create.loan.dto.js';
export declare class LoansController {
    private readonly loansService;
    constructor(loansService: LoansService);
    borrow(dto: CreateLoanDto): Promise<import("./loans.repository.js").LoanRecord | null>;
}
