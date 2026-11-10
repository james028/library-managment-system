import { Test } from '@nestjs/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MembersController } from './members.controller.js';
import { MembersService } from './members.service.js';

import { QueryMemberDto } from './dto/query-member.dto.js';
import { CreateMemberDto } from './dto/create-member.dto.js';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';

describe('MembersController', () => {
  let controller: MembersController;
  let service: MembersService;

  const currentUser = {
    userId: 'user-1',
    email: 'admin@example.com',
    role: 'ADMIN',
  } as CurrentUserPayload;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [
        {
          provide: MembersService,
          useValue: {
            getMembers: vi.fn(),
            createMemberManually: vi.fn(),
            importFromCsv: vi.fn(),
          },
        },
      ],
    })

      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = moduleRef.get(MembersController);
    service = moduleRef.get(MembersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllMembers', () => {
    it('should call service with query and return its result', async () => {
      // Arrange
      const query = { page: 1, size: 10 } as QueryMemberDto;
      const expectedResult = { items: [], total: 0, page: 1, size: 10 };

      (service.getMembers as ReturnType<typeof vi.fn>).mockResolvedValue(
        expectedResult,
      );

      // Act
      const result = await controller.getAllMembers(query);

      // Assert
      expect(service.getMembers).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });

    it('should pass search filter to service', async () => {
      // Arrange
      const query = { search: 'jan', page: 1, size: 10 } as QueryMemberDto;
      const expectedResult = { items: [], total: 0 };

      (service.getMembers as ReturnType<typeof vi.fn>).mockResolvedValue(
        expectedResult,
      );

      // Act
      const result = await controller.getAllMembers(query);

      // Assert
      expect(service.getMembers).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createNewMember', () => {
    it('should call service with user and dto', async () => {
      // Arrange
      const dto = {
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan@example.com',
        cardNumber: 'CARD-1',
      } as CreateMemberDto;

      const expectedResult = { id: 1, email: 'jan@example.com' };

      (
        service.createMemberManually as ReturnType<typeof vi.fn>
      ).mockResolvedValue(expectedResult);

      // Act
      const result = await controller.createNewMember(dto, currentUser);

      // Assert
      expect(service.createMemberManually).toHaveBeenCalledWith(
        currentUser,
        dto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('importMembers', () => {
    const makeFile = (content: string): Express.Multer.File =>
      ({
        buffer: Buffer.from(content, 'utf-8'),
        mimetype: 'text/csv',
        size: 100,
      }) as Express.Multer.File;

    it('should call service with userId and file', async () => {
      // Arrange
      const file = makeFile('firstName,lastName\nJan,Kowalski');
      const expectedResult = { imported: 1, failed: 0, errors: [] };

      (service.importFromCsv as ReturnType<typeof vi.fn>).mockResolvedValue(
        expectedResult,
      );

      // Act
      const result = await controller.importMembers(file, currentUser);

      // Assert
      expect(service.importFromCsv).toHaveBeenCalledWith('user-1', file);
      expect(result).toEqual(expectedResult);
    });

    it('should call service exactly once', async () => {
      // Arrange
      const file = makeFile('firstName,lastName\nAnna,Nowak');
      const expectedResult = { imported: 1, failed: 0, errors: [] };

      (service.importFromCsv as ReturnType<typeof vi.fn>).mockResolvedValue(
        expectedResult,
      );

      // Act
      await controller.importMembers(file, currentUser);

      // Assert
      expect(service.importFromCsv).toHaveBeenCalledTimes(1);
    });
  });
});
