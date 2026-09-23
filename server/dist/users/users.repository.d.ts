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
export declare class UsersRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(params: {
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
    }): Promise<UserRecord>;
    findByEmail(email: string): Promise<UserRecord | null>;
    findById(id: string): Promise<UserRecord | null>;
}
