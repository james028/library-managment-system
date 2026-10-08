import { DatabaseService } from '../database/database.service.js';
export interface LoanRecord {
    id: string;
    book_copy_id: string;
    user_id: string;
    borrowed_at: Date;
    due_at: Date;
    returned_at: Date | null;
    extended_count: number;
}
export interface LoanWithDetails extends LoanRecord {
    book_title: string;
    inventory_number: string;
}
export interface LoansSummary {
    activeLoans: number;
    overdueLoans: number;
    toReturnToday: number;
    returnedToday: number;
}
export declare class LoansRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    borrow(params: {
        bookCopyId: string;
        userId: string;
        dueAt: Date;
    }): Promise<LoanRecord | null>;
    findById(id: string): Promise<LoanRecord | null>;
    returnLoan(id: string, fineRatePerDay: number): Promise<LoanRecord | null>;
    findAllForUser(userId: string): Promise<LoanWithDetails[]>;
    returnSummaryData(): Promise<LoansSummary>;
}
