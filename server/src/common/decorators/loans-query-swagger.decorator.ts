import { ApiQuery } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { LoanStatus } from '../../loans/enums/loan-status.enum.js';

export const LoansQuerySwagger = () =>
  applyDecorators(
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      example: 'Nowy wspaniały świat',
      description:
        'Wyszukiwanie po tytule, autorze, barcode, numerze karty, e-mailu oraz imieniu i nazwisku czytelnika.',
    }),

    ApiQuery({
      name: 'status',
      required: false,
      enum: LoanStatus,
      example: LoanStatus.ACTIVE,
      description: 'Status wypożyczenia: ACTIVE, OVERDUE lub RETURNED.',
    }),

    ApiQuery({
      name: 'memberId',
      required: false,
      type: String,
      example: '343453535434',
      description: 'ID czytelnika.',
    }),

    ApiQuery({
      name: 'bookId',
      required: false,
      type: Number,
      example: 34,
      description: 'ID książki.',
    }),

    ApiQuery({
      name: 'bookCopyId',
      required: false,
      type: Number,
      example: 78,
      description: 'ID egzemplarza książki.',
    }),

    ApiQuery({
      name: 'borrowedFrom',
      required: false,
      type: String,
      format: 'date',
      example: '2026-10-01',
      description: 'Data wypożyczenia od — włącznie.',
    }),

    ApiQuery({
      name: 'borrowedTo',
      required: false,
      type: String,
      format: 'date',
      example: '2026-10-31',
      description:
        'Data wypożyczenia do — włącznie; backend filtruje jako < następny dzień.',
    }),

    ApiQuery({
      name: 'dueFrom',
      required: false,
      type: String,
      format: 'date',
      example: '2026-10-01',
      description: 'Termin zwrotu od — włącznie.',
    }),

    ApiQuery({
      name: 'dueTo',
      required: false,
      type: String,
      format: 'date',
      example: '2026-10-31',
      description:
        'Termin zwrotu do — włącznie; backend filtruje jako < następny dzień.',
    }),

    ApiQuery({
      name: 'returnedFrom',
      required: false,
      type: String,
      format: 'date',
      example: '2026-10-01',
      description: 'Data faktycznego zwrotu od — włącznie.',
    }),

    ApiQuery({
      name: 'returnedTo',
      required: false,
      type: String,
      format: 'date',
      example: '2026-10-31',
      description:
        'Data faktycznego zwrotu do — włącznie; backend filtruje jako < następny dzień.',
    }),

    ApiQuery({
      name: 'active',
      required: false,
      type: Boolean,
      example: true,
      description:
        'true — tylko niezwrócone wypożyczenia, w tym przeterminowane.',
    }),

    ApiQuery({
      name: 'overdue',
      required: false,
      type: Boolean,
      example: true,
      description:
        'true — tylko niezwrócone wypożyczenia, których termin zwrotu już minął.',
    }),

    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'Numer strony, zaczynając od 1.',
    }),

    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      example: 20,
      description: 'Liczba wyników na stronę, maksymalnie 100.',
    }),
  );