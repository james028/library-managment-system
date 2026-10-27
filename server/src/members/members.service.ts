import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { MembersRepository } from './members.repository.js';
import { QueryMemberDto } from './dto/query-member.dto.js';
import { PaginatedMembers } from './interfaces/paginated-members.interface.dto.js';
import { CreateMemberDto } from './dto/create-member.dto.js';
import { MemberDetails } from './interfaces/members.interface.dto.js';
import { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';

const MIN_SEARCH_LENGTH = 2;

@Injectable()
export class MembersService {
  constructor(private readonly membersRepository: MembersRepository) {}

  async getMembers(query: QueryMemberDto): Promise<PaginatedMembers> {
    const normalizedQuery = this.normalizeQuery(query);

    return this.membersRepository.findMembers(normalizedQuery);
  }

  async createMember(
    user: CurrentUserPayload,
    dto: CreateMemberDto,
  ): Promise<MemberDetails> {
    const existingMember =
      await this.membersRepository.findMemberByUserId(user.userId);

    if (existingMember) {
      throw new ConflictException(
        'A library member account already exists for this user.',
      );
    }

    if (user.role !== 'ADMIN') {
      throw new ConflictException('Only members can have a library card.');
    }

    return this.membersRepository.createMember(user.userId, dto.cardNumber);
  }

  private normalizeQuery(query: QueryMemberDto): QueryMemberDto {
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
