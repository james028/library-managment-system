import { BadRequestException, Injectable } from '@nestjs/common';
import { MembersRepository } from './members.repository.js';
import { MemberQueryDto } from './dto/member-query.dto.js';
import { PaginatedMembers } from './interfaces/paginated-members.interface.dto.js';

const MIN_SEARCH_LENGTH = 2;

@Injectable()
export class MembersService {
  constructor(private readonly membersRepository: MembersRepository) {}

  async getMembers(query: MemberQueryDto): Promise<PaginatedMembers> {
    const normalizedQuery = this.normalizeQuery(query);

    return this.membersRepository.findMembers(normalizedQuery);
  }

  private normalizeQuery(query: MemberQueryDto): MemberQueryDto {
    const search = query.search?.trim();

    if (
      search !== undefined &&
      search.length > 0 &&
      search.length < MIN_SEARCH_LENGTH
    ) {
      throw new BadRequestException(
        `Search phrase must contain at least ${MIN_SEARCH_LENGTH} characters.`,
      );
    }

    return {
      ...query,
      search: search || undefined,
    };
  }
}
