import { CreateBookCopyDto } from './dto/create-book-copy.dto.js';
import { BookCopiesService } from './book-copies.service.js';
import { UpdateBookCopyDto } from './dto/update-book-copy.dto.js';
export declare class BookCopiesController {
    private readonly bookCopiesService;
    constructor(bookCopiesService: BookCopiesService);
    findAllForBook(bookId: string): Promise<import("./book-copies.repository.js").BookCopyWithTitle[]>;
    create(bookId: string, dto: CreateBookCopyDto): Promise<import("./book-copies.repository.js").BookCopyRecord>;
    update(id: string, dto: UpdateBookCopyDto): Promise<import("./book-copies.repository.js").BookCopyRecord>;
    remove(id: string): Promise<void>;
}
