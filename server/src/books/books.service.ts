import { Injectable, NotFoundException } from '@nestjs/common';
import { BooksRepository } from './books.repository.js';
import { CreateBookDto } from './dto/createbook.dto.js';
import { UpdateBookDto } from './dto/updatebook.dto.js';

@Injectable()
export class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  async findAllBooks(page = 1, limit = 20, search?: string) {
    const offset = (page - 1) * limit;
    const { items, total } = await this.booksRepository.findAllBooks({ limit, offset, search });

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const book = await this.booksRepository.findById(id);
    if (!book) {
      throw new NotFoundException(`Książka o id ${id} nie istnieje`);
    }
    return book;
  }

  create(dto: CreateBookDto) {
    return this.booksRepository.create(dto);
  }

  async update(id: string, dto: UpdateBookDto) {
    const updated = await this.booksRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Książka o id ${id} nie istnieje`);
    }
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.booksRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Książka o id ${id} nie istnieje`);
    }
  }
}