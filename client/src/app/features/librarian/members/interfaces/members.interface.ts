export interface MemberMock {
  id: number;
  firstName: string;
  lastName: string;
  cardNumber: string;
  email: string;
  phone: string | null;
  status: string;
  activeLoans: number;
  activeReservations: number;
  unpaidFinesAmount: string;
  createdAt: string;
}
