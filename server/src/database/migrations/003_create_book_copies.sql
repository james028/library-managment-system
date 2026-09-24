-- 003_create_book_copies.sql

CREATE TYPE copy_status AS ENUM ('available', 'checked_out', 'reserved', 'lost', 'under_repair');

CREATE TABLE book_copies
(
    id               UUID PRIMARY KEY            DEFAULT gen_random_uuid(),
    book_id          UUID               NOT NULL REFERENCES books (id) ON DELETE CASCADE,
    inventory_number VARCHAR(50) UNIQUE NOT NULL,
    status           copy_status        NOT NULL DEFAULT 'available',
    condition        VARCHAR(100),
    acquired_at      DATE               NOT NULL DEFAULT CURRENT_DATE,
    created_at       TIMESTAMP          NOT NULL DEFAULT now(),
    updated_at       TIMESTAMP          NOT NULL DEFAULT now()
);

-- najczęstsze zapytanie: "pokaż wszystkie egzemplarze danej książki"
CREATE INDEX idx_book_copies_book_id ON book_copies (book_id);