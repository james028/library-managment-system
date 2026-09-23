import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: 'member' | 'librarian' | 'admin';
  is_active: boolean;
}

@Injectable()
export class UsersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(params: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
  }): Promise<UserRecord> {
    const { email, passwordHash, firstName, lastName } = params;

    const results = await this.databaseService.query<UserRecord>(
      `INSERT INTO users (email, password_hash, first_name, last_name)
        VALUES ($1, $2, $3,$4) 
            RETURNING id, email, password_hash, first_name, last_name, role, is_active, created_at`,
      [email, passwordHash, firstName, lastName],
    );

    return results.rows[0] ?? null;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const result = await this.databaseService.query<UserRecord>(
      `SELECT id, email, password_hash, first_name, last_name, role, is_active, created_at
       FROM users
       WHERE email = $1`,
      [email],
    );

    return result.rows[0] ?? null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    const result = await this.databaseService.query<UserRecord>(
      `SELECT id, email, password_hash, first_name, last_name, role, is_active, created_at
       FROM users
       WHERE id = $1`,
      [id],
    );

    return result.rows[0] ?? null;
  }
}
