import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository, UserRecord } from './users.repository.js';

// Publiczny kształt usera — to jedyna rzecz, jaka opuszcza ten serwis.
// password_hash NIGDY nie trafia do odpowiedzi API.
export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

export interface UserRecordExtended extends UserRecord {
  created_at: Date;
}

function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    isActive: user.is_active,
    createdAt: user.created_at,
  };
}

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Użytkownik nie istnieje');
    }
    return toPublicUser(user);
  }
}
