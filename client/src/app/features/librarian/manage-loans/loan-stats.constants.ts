import { LoanStatsEnum, LoanStatsKey } from './models/loan-model';


export const LOAN_STATS_LABELS: Record<LoanStatsKey, string> = {
  [LoanStatsEnum.ACTIVE_LOANS]: 'Aktywne wypożyczenia',
  [LoanStatsEnum.OVERDUE_LOANS]: 'Przeterminowane wypożyczenia',
  [LoanStatsEnum.TO_RETURN_TODAY]: 'Do zwrotu dzisiaj',
  [LoanStatsEnum.RETURNED_TODAY]: 'Zwrócone dzisiaj',
};

export function getLoanStatsLabel(key: string): string {
  return LOAN_STATS_LABELS[key as LoanStatsKey] ?? 'Nieznana statystyka';
}
