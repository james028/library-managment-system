-- 002_create_books.sql

CREATE TABLE books
(
    id             UUID PRIMARY KEY      DEFAULT gen_random_uuid(),
    title          VARCHAR(255) NOT NULL,
    author         VARCHAR(255) NOT NULL, -- temporary, when we create book_authors table, we will remove author column from here
    isbn           VARCHAR(20) UNIQUE,
    publisher      VARCHAR(255),
    published_year INT,
    description    TEXT,
    created_at     TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP    NOT NULL DEFAULT now()
);

-- przyda się, jak zaczniesz wyszukiwać po tytule w katalogu
CREATE INDEX idx_books_title ON books (title);