import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/createbook.dto.js';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    findAll(page?: string, limit?: string, search?: string): Promise<{
        items: import("./books.repository.js").BookRecord[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    create(dto: CreateBookDto): Promise<import("./books.repository.js").BookRecord>;
}
