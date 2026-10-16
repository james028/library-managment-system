import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MembersService } from './members.service.js';
import { PaginatedMembers } from './interfaces/paginated-members.interface.dto.js';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {
  }

  @Get()
  @ApiOperation({
    summary: 'Get all settings',
    description: 'Returns list of all settings or by specific keys',
  })
  getAllMembers(@Query() query: any): Promise<PaginatedMembers> {
    return this.membersService.getMembers(query);
  }
}
