import { Test } from '@nestjs/testing';

import { BadRequestException, ConflictException } from '@nestjs/common';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MembersService } from './members.service.js';
import { MembersRepository } from './members.repository.js';
import { UsersRepository } from '../users/users.repository.js';

import { QueryMemberDto } from './dto/query-member.dto.js';
import { CreateMemberDto } from './dto/create-member.dto.js';
import { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';

describe('MembersService', () => {
  let service: MembersService;
  let membersRepository: MembersRepository;
  let usersRepository: UsersRepository;

  const currentUser: CurrentUserPayload = {
    id: 'user-1',
    email: 'admin@example.com',
    role: 'ADMIN',
  } as unknown as CurrentUserPayload;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: MembersRepository,
          useValue: {
            findMembers: vi.fn(),
            findMemberByCardNumber: vi.fn(),
            createMemberWithInvitation: vi.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: vi.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(MembersService);
    membersRepository = moduleRef.get(MembersRepository);
    usersRepository = moduleRef.get(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMembers', () => {
    it('should normalize search and call repository', async () => {
      const query: QueryMemberDto = {
        search: '  jan  ',
        page: 1,
        limit: 10,
      } as unknown as QueryMemberDto;

      const expected = {
        search: 'jan',
        page: 1,
        limit: 10,
      };

      const members = { items: [], total: 0 };

      (
        membersRepository.findMembers as ReturnType<typeof vi.fn>
      ).mockResolvedValue(members);

      const result = await service.getMembers(query);

      expect(membersRepository.findMembers).toHaveBeenCalledWith(expected);
      expect(result).toEqual(members);
    });

    it('should throw BadRequestException when search is too short', async () => {
      const query: QueryMemberDto = { search: 'a' } as QueryMemberDto;

      await expect(service.getMembers(query)).rejects.toThrow(
        BadRequestException,
      );
      expect(membersRepository.findMembers).not.toHaveBeenCalled();
    });

    it('should pass query without search when search is empty', async () => {
      const query: QueryMemberDto = { search: '   ' } as QueryMemberDto;

      (
        membersRepository.findMembers as ReturnType<typeof vi.fn>
      ).mockResolvedValue({ items: [], total: 0 });

      await service.getMembers(query);

      expect(membersRepository.findMembers).toHaveBeenCalledWith({
        search: undefined,
      });
    });
  });

  describe('createMemberManually', () => {
    it('should create member when email and card number are free', async () => {
      const dto: CreateMemberDto = {
        firstName: '  Jan ',
        lastName: ' Kowalski ',
        email: ' Jan@Example.COM ',
        cardNumber: ' card-1 ',
      } as CreateMemberDto;

      const created = { id: 1 };

      (
        usersRepository.findByEmail as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);
      (
        membersRepository.findMemberByCardNumber as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);
      (
        membersRepository.createMemberWithInvitation as ReturnType<typeof vi.fn>
      ).mockResolvedValue(created);

      const result = await service.createMemberManually(currentUser, dto);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        'jan@example.com',
      );
      expect(membersRepository.findMemberByCardNumber).toHaveBeenCalledWith(
        'CARD-1',
      );
      expect(membersRepository.createMemberWithInvitation).toHaveBeenCalledWith(
        {
          firstName: 'Jan',
          lastName: 'Kowalski',
          email: 'jan@example.com',
          cardNumber: 'CARD-1',
        },
      );
      expect(result).toEqual(created);
    });

    it('should throw ConflictException when email already exists', async () => {
      const dto: CreateMemberDto = {
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan@example.com',
        cardNumber: 'CARD-1',
      } as CreateMemberDto;

      (
        usersRepository.findByEmail as ReturnType<typeof vi.fn>
      ).mockResolvedValue({ id: 2 });

      await expect(
        service.createMemberManually(currentUser, dto),
      ).rejects.toThrow(ConflictException);
      expect(
        membersRepository.createMemberWithInvitation,
      ).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when card number already exists', async () => {
      const dto: CreateMemberDto = {
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan@example.com',
        cardNumber: 'CARD-1',
      } as CreateMemberDto;

      (
        usersRepository.findByEmail as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);
      (
        membersRepository.findMemberByCardNumber as ReturnType<typeof vi.fn>
      ).mockResolvedValue({ id: 3 });

      await expect(
        service.createMemberManually(currentUser, dto),
      ).rejects.toThrow(ConflictException);
      expect(
        membersRepository.createMemberWithInvitation,
      ).not.toHaveBeenCalled();
    });
  });

  describe('importFromCsv', () => {
    const makeFile = (content: string, mimetype = 'text/csv', size = 100) =>
      ({
        buffer: Buffer.from(content, 'utf-8'),
        mimetype,
        size,
      }) as Express.Multer.File;

    it('should throw BadRequestException when file is missing', async () => {
      await expect(service.importFromCsv('user-1', undefined)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for non-CSV mimetype', async () => {
      const file = makeFile(
        'firstName,lastName\nJan,Kowalski',
        'application/json',
      );

      await expect(service.importFromCsv('user-1', file)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when CSV is empty', async () => {
      const file = makeFile('');

      await expect(service.importFromCsv('user-1', file)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should import valid rows', async () => {
      const csv = [
        'firstName,lastName,email,cardNumber,status',
        'Jan,Kowalski,jan@example.com,CARD-1,ACTIVE',
      ].join('\n');

      const file = makeFile(csv);

      (
        membersRepository.createMemberWithInvitation as ReturnType<typeof vi.fn>
      ).mockResolvedValue({});

      const result = await service.importFromCsv('user-1', file);

      expect(result.imported).toBe(1);
      expect(result.failed).toBe(0);
      expect(result.errors).toEqual([]);
      expect(membersRepository.createMemberWithInvitation).toHaveBeenCalledWith(
        {
          firstName: 'Jan',
          lastName: 'Kowalski',
          email: 'jan@example.com',
          cardNumber: 'CARD-1',
          status: 'ACTIVE',
        },
      );
    });

    it('should collect errors for invalid rows without throwing', async () => {
      const csv = [
        'firstName,lastName,email,cardNumber,status',
        ',Kowalski,jan@example.com,CARD-1,ACTIVE',
      ].join('\n');

      const file = makeFile(csv);

      const result = await service.importFromCsv('user-1', file);

      expect(result.imported).toBe(0);
      expect(result.failed).toBe(1);
      expect(result.errors[0].row).toBe(2);
      expect(result.errors[0].message).toBe('First name is required');
    });
  });
});
