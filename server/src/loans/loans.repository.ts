import { Injectable } from '@nestjs/common';
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

@Injectable()
export class LoansRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async borrow(params: {
    bookCopyId: string;
    userId: string;
    dueAt: Date;
    //@ts-ignore
  }): Promise<LoanRecord | null> {

  }
}
