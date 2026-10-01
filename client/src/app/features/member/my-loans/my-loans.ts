import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, map, tap } from 'rxjs';
import { LoansService, Loan } from '../../../core/services/LoansService.js';
import { FinesService, Fine } from '../../../core/services/FinesService.js';

interface LoanView extends Loan {
  isOverdue: boolean;
  fine?: Fine;
}

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-loans.html',
  styleUrl: './my-loans.scss',
})
export class MyLoans {
  // constructor(
  //   private loansService: LoansService,
  //   private finesService: FinesService,
  // ) {}

  private loansService = inject(LoansService);
  private finesService = inject(FinesService);

  readonly loans$ = combineLatest([
    this.loansService.getMyLoans(),
    this.finesService.getMyFines(),
  ]).pipe(
    tap(([loans, fines]) => {
      console.log(loans, fines);
    }),
    map(([loans, fines]): LoanView[] => {
      return loans.map((loan) => {
        return {
          ...loan,
          isOverdue: loan.returned_at === null && new Date(loan.due_at) < new Date(),
          fine: fines.find((fine) => fine.loan_id === loan.id),
        };
      });
    }),
  );
}
