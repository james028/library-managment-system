import { BooksRepository } from './books.repository.js';
import { CreateBookDto } from './dto/createbook.dto.js';
import { UpdateBookDto } from './dto/updatebook.dto.js';
export declare class BooksService {
    private readonly booksRepository;
    constructor(booksRepository: BooksRepository);
    findAllBooks(page?: number, limit?: number, search?: string): Promise<{
        items: import("./books.repository.js").BookRecord[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./books.repository.js").BookRecord>;
    create(dto: CreateBookDto): Promise<import("./books.repository.js").BookRecord>;
    update(id: string, dto: UpdateBookDto): Promise<import("./books.repository.js").BookRecord>;
    remove(id: string): Promise<void>;
}
