import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { MemberDetails, MembersRepository } from './members.repository.js';
import { MemberQueryDto } from './dto/member-query.dto.js';
import { PaginatedMembers } from './interfaces/paginated-members.interface.dto.js';
import { CreateMemberDto } from './dto/create-member.dto.js';

const MIN_SEARCH_LENGTH = 2;

@Injectable()
export class MembersService {
  constructor(private readonly membersRepository: MembersRepository) {}

  async getMembers(query: MemberQueryDto): Promise<PaginatedMembers> {
    const normalizedQuery = this.normalizeQuery(query);

    return this.membersRepository.findMembers(normalizedQuery);
  }

  async createMember(
    userId: string,
    dto: CreateMemberDto,
  ): Promise<MemberDetails> {
    const existingMember =
      await this.membersRepository.findMemberByUserId(userId);

    if (existingMember) {
      throw new ConflictException(
        'A library member account already exists for this user.',
      );
    }

    return this.membersRepository.createMember(userId, dto.cardNumber);
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
