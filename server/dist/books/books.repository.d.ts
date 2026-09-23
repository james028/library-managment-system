import { DatabaseService } from '../database/database.service.js';
export interface BookRecord {
    id: string;
    title: string;
    author: string;
    isbn: string | null;
    publisher: string | null;
    published_year: number | null;
    description: string | null;
    created_at: Date;
    updated_at: Date;
}
export declare class BooksRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    findAllBooks(params: {
        limit: number;
        offset: number;
        search?: string;
    }): Promise<{
        items: BookRecord[];
        total: number;
    }>;
    findById(id: string): Promise<BookRecord | null>;
    delete(id: string): Promise<boolean>;
}
