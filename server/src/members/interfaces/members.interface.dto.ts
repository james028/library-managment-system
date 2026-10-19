export interface Member {
  id: number;
  firstName: string; // z tabeli users
  lastName: string; // z tabeli users
  cardNumber: string;
  email: string; // z tabeli users
  status: 'ACTIVE' | 'BLOCKED';
  //activeLoans: number; // z tabeli wypozyczenia
  //activeReservations: number; // z tabeli rezerwacje
  //unpaidFinesAmount: string; // z tabeli kary
  createdAt: string;
}

export interface MemberDetails {
  id: number;
  //firstName: string;
  //lastName: string;
  //email: string;
  cardNumber: string;
  status: 'ACTIVE' | 'BLOCKED';
  //activeLoans: number;
  //activeReservations: number;
  //unpaidFinesAmount: string;
  createdAt: string;
  updatedAt: string;
}