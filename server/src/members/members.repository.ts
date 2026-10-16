import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { MemberQueryDto } from './dto/member-query.dto.js';
import { PaginatedMembers } from './interfaces/paginated-members.interface.dto.js';


@Injectable()
export class MembersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  // @ts-ignore
  async findMembers(query: MemberQueryDto): Promise<PaginatedMembers> {

  }
}