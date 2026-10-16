import { Member } from './members.interface.dto.js';

export interface PaginatedMembers {
  items: Member[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}