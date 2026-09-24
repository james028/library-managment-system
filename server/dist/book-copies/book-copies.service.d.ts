import { BookCopiesRepository } from './book-copies.repository.js';
import { BooksService } from '../books/books.service.js';
import { CreateBookCopyDto } from './dto/create-book-copy.dto.js';
import { UpdateBookCopyDto } from './dto/update-book-copy.dto.js';
export declare class BookCopiesService {
    private readonly bookCopiesRepository;
    private readonly booksService;
    constructor(bookCopiesRepository: BookCopiesRepository, booksService: BooksService);
    findAllForBook(bookId: string): Promise<import("./book-copies.repository.js").BookCopyWithTitle[]>;
    create(bookId: string, dto: CreateBookCopyDto): Promise<import("./book-copies.repository.js").BookCopyRecord>;
    update(id: string, dto: UpdateBookCopyDto): Promise<import("./book-copies.repository.js").BookCopyRecord>;
    delete(copyId: string): Promise<void>;
}
