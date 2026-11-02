import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { MembersRepository } from './members.repository.js';
import { QueryMemberDto } from './dto/query-member.dto.js';
import { PaginatedMembers } from './interfaces/paginated-members.interface.dto.js';
import { CreateMemberDto } from './dto/create-member.dto.js';
import { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';
import {
  MEMBER_IMPORT_ALLOWED_MIME_TYPES,
  MEMBER_IMPORT_MAX_FILE_SIZE,
} from './dto/members-import.constants.dto.js';
import { parse } from 'csv-parse';
import { UsersRepository } from '../users/users.repository.js';

const MIN_SEARCH_LENGTH = 2;

interface MemberImportRow {
  firstName: string;
  lastName: string;
  email: string;
  cardNumber: string;
  status: string;
}

interface MemberImportError {
  row: number;
  email?: string;
  message: string;
}

export interface MemberImportResult {
  imported: number;
  failed: number;
  errors: MemberImportError[];
}

@Injectable()
export class MembersService {
  constructor(
    private readonly membersRepository: MembersRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async getMembers(query: QueryMemberDto): Promise<PaginatedMembers> {
    const normalizedQuery = this.normalizeQuery(query);

    return this.membersRepository.findMembers(normalizedQuery);
  }

  async createMemberManually(
    currentUser: CurrentUserPayload,
    dto: CreateMemberDto,
  ): Promise<any> {
    // if (currentUser.role !== 'ADMIN') {
    //   throw new ForbiddenException(
    //     'Only administrators can create library members',
    //   );
    // }

    const email = dto.email.trim().toLowerCase();
    const cardNumber = dto.cardNumber.trim().toUpperCase();

    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const existingCard =
      await this.membersRepository.findMemberByCardNumber(cardNumber);

    if (existingCard) {
      throw new ConflictException(
        'A library member with this card number already exists',
      );
    }

    return await this.membersRepository.createMemberWithInvitation({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email,
      cardNumber,
    });
  }

  async importFromCsv(
    userId: string,
    file: Express.Multer.File | undefined,
  ): Promise<MemberImportResult> {
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }

    if (!MEMBER_IMPORT_ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Only CSV files are allowed');
    }

    if (file.size > MEMBER_IMPORT_MAX_FILE_SIZE) {
      throw new BadRequestException('CSV file is too large');
    }

    const rows = await this.parseCsv(file.buffer.toString('utf-8'));

    if (!rows.length) {
      throw new BadRequestException('CSV file is empty');
    }

    const result: MemberImportResult = {
      imported: 0,
      failed: 0,
      errors: [],
    };

    for (const [index, row] of rows.entries()) {
      const rowNumber = index + 2; // +1 header, +1 because arrays start at 0

      try {
        const member = this.validateRow(row);

        await this.membersRepository.createMemberWithInvitation(member);

        result.imported += 1;
      } catch (error) {
        result.failed += 1;
        result.errors.push({
          row: rowNumber,
          email: row.email,
          message:
            error instanceof Error ? error.message : 'Unknown import error',
        });
      }
    }

    console.log(result);
    return result;
  }

  private async parseCsv(content: string): Promise<MemberImportRow[]> {
    return new Promise((resolve, reject) => {
      parse(
        content,
        {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        },
        (error, records: MemberImportRow[]) => {
          if (error) {
            reject(new BadRequestException('Invalid CSV file'));
            return;
          }
          resolve(records);
        },
      );
    });
  }

  private validateRow(row: MemberImportRow): MemberImportRow {
    const email = row.email?.trim().toLowerCase();

    if (!row.firstName?.trim()) {
      throw new Error('First name is required');
    }

    if (!row.lastName?.trim()) {
      throw new Error('Last name is required');
    }

    if (!email) {
      throw new Error('Email is required');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email format');
    }

    if (!row.cardNumber?.trim()) {
      throw new Error('Card number is required');
    }

    const status = row.status?.trim().toUpperCase() || 'ACTIVE';

    if (!['ACTIVE', 'BLOCKED'].includes(status)) {
      throw new Error('Invalid status');
    }

    return {
      firstName: row.firstName.trim(),
      lastName: row.lastName.trim(),
      email,
      cardNumber: row.cardNumber.trim(),
      status,
    };
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
