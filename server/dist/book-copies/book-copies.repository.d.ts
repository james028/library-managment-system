import { DatabaseService } from '../database/database.service.js';
import { CreateBookCopyDto } from './dto/create-book-copy.dto.js';
import { UpdateBookCopyDto } from './dto/update-book-copy.dto.js';
export interface BookCopyRecord {
    id: string;
    book_id: string;
    inventory_number: string;
    status: string;
    condition: string | null;
    acquired_at: Date;
    created_at: Date;
    updated_at: Date;
}
export interface BookCopyWithTitle extends BookCopyRecord {
    book_title: string;
}
export declare class BookCopiesRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    findAllByBookId(bookId: string): Promise<BookCopyWithTitle[]>;
    create(bookId: string, dto: CreateBookCopyDto): Promise<BookCopyRecord>;
    update(id: string, dto: UpdateBookCopyDto): Promise<BookCopyRecord | null>;
    delete(id: string): Promise<any>;
}
