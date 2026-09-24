import { Injectable, NotFoundException } from '@nestjs/common';
import { BookCopiesRepository } from './book-copies.repository.js';
import { BooksService } from '../books/books.service.js';
import { CreateBookCopyDto } from './dto/create-book-copy.dto.js';
import { UpdateBookCopyDto } from './dto/update-book-copy.dto.js';

@Injectable()
export class BookCopiesService {
  constructor(private readonly bookCopiesRepository: BookCopiesRepository, private readonly booksService: BooksService) {
  }


  async findAllForBook(bookId: string) {
    // findOne rzuci NotFoundException, jeśli książka nie istnieje —
    // dzięki temu nie musimy tej logiki powtarzać tutaj.
    await this.booksService.findOne(bookId);
    return this.bookCopiesRepository.findAllByBookId(bookId);
  }

  async create(bookId: string, dto: CreateBookCopyDto) {
    await this.booksService.findOne(bookId); // 404, jeśli książka nie istnieje

    console.log(bookId, dto, 'copies');
    try {
      return await this.bookCopiesRepository.create(bookId, dto);
    } catch (error) {
      // console.log(error, "error");
      // // Siatka bezpieczeństwa na wypadek, gdyby globalny exception filter (z Punktu 3)
      // // jeszcze nie był gotowy — inventory_number ma UNIQUE constraint w bazie.
      // if ((error as { code?: string }).code === '23505') {
      //   throw new ConflictException('Egzemplarz o tym numerze inwentarzowym już istnieje');
      // }
      throw error;
    }
  }

  async update(id: string, dto: UpdateBookCopyDto) {
    const updated = await this.bookCopiesRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Egzemplarz o id ${id} nie istnieje`);
    }
    return updated;
  }

  async delete(copyId: string) {
    const deleted = await this.bookCopiesRepository.delete(copyId);
    if (deleted) {
      throw new NotFoundException(`Egzemplarz o id ${copyId} nie istnieje`);
    }
  }
}
