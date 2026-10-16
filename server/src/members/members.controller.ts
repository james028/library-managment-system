import { Body, Controller, Get, Query, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MembersService } from './members.service.js';
import { PaginatedMembers } from './interfaces/paginated-members.interface.dto.js';
import { CreateMemberDto } from './dto/create-member.dto.js';
import {
  CurrentUser
} from '../common/decorators/current-user.decorator.js';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';


@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all settings',
    description: 'Returns list of all settings or by specific keys',
  })
  getAllMembers(@Query() query: any): Promise<PaginatedMembers> {
    return this.membersService.getMembers(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Create member',
    description: 'Crate a new member',
  })
  createNewMember(
    @Body() dto: CreateMemberDto,
    @CurrentUser() user: CurrentUserPayload
  ) {
    console.log(user);
    return this.membersService.createMember(user.userId, dto);
  }
}
