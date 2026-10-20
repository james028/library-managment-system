// Mapa: pole z DTO -> bezpieczna kolumna SQL.
export const MEMBER_SORT_COLUMNS = {
  createdAt: 'm.created_at',
  lastName: 'm.last_name', //you can add another parameters depends on what you want to sort
  //activeLoans: '"activeLoans"',
} as const;

export const EXISTS_SQL = {
  hasActiveLoans: `
    EXISTS (
      SELECT 1
      FROM loans l
      WHERE l.user_id = m.user_id
        AND l.returned_at IS NULL
    )
  `,
  hasOverdueLoans: `
    EXISTS (
      SELECT 1
      FROM loans l
      WHERE l.user_id = m.user_id
        AND l.returned_at IS NULL
        AND l.due_at < NOW()
    )
  `,
  hasUnpaidFines: `
    EXISTS (
      SELECT 1
      FROM fines f
      INNER JOIN loans l ON l.id = f.loan_id
      WHERE l.user_id = m.user_id
        AND f.paid = false
    )
  `,
} as const;