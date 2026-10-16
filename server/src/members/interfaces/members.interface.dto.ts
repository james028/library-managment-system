export interface Member {
  id: number;
  firstName: string; // z tabeli users
  lastName: string; // z tabeli users
  cardNumber: string;
  email: string; // z tabeli users
  status: 'ACTIVE' | 'BLOCKED';
  activeLoans: number; // z tabeli wypozyczenia
  activeReservations: number; // z tabeli rezerwacje
  unpaidFinesAmount: string; // z tabeli kary
  createdAt: string;
}