import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MemberImportResult, MembersService } from './members.service.js';
import { PaginatedMembers } from './interfaces/paginated-members.interface.dto.js';
import { CreateMemberDto } from './dto/create-member.dto.js';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { QueryMemberDto } from './dto/query-member.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  MEMBER_IMPORT_ALLOWED_MIME_TYPES,
  MEMBER_IMPORT_FILE_FIELD,
  MEMBER_IMPORT_MAX_FILE_SIZE,
} from './dto/members-import.constants.dto.js';

@Controller('members')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated members' })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['ACTIVE', 'BLOCKED'],
  })
  @ApiQuery({ name: 'createdFrom', required: false, type: Date })
  @ApiQuery({ name: 'createdTo', required: false, type: Date })
  @ApiQuery({ name: 'hasActiveLoans', required: false, type: Boolean })
  @ApiQuery({ name: 'hasOverdueLoans', required: false, type: Boolean })
  @ApiQuery({
    name: 'hasUnpaidFines',
    required: false,
    type: Boolean,
  }) // @ApiQuery({ name: 'sort', required: false, enum: ['createdAt', 'lastName', 'activeLoans', 'totalUnpaidFinesAmount'] })
  // @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
  })
  getAllMembers(@Query() query: QueryMemberDto): Promise<PaginatedMembers> {
    return this.membersService.getMembers(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Create member',
    description: 'Crate a new member',
  })
  createNewMember(
    @Body() dto: CreateMemberDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.membersService.createMemberManually(user, dto);
  }


  @Post('import')
  @UseInterceptors(
    FileInterceptor(MEMBER_IMPORT_FILE_FIELD, {
      limits: {
        fileSize: MEMBER_IMPORT_MAX_FILE_SIZE,
      },
      fileFilter: (_req, file, callback) => {
        const isValid =
          MEMBER_IMPORT_ALLOWED_MIME_TYPES.includes(file.mimetype);

        callback(
          isValid
            ? null
            : new Error('Only CSV files are allowed'),
          isValid,
        );
      },
    }),
  )
  importMembers(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<MemberImportResult> {
    return this.membersService.importFromCsv(user.userId, file);
  }
}
