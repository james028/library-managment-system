-- 004_create_loans.sql

CREATE TABLE loans
(
    id             UUID PRIMARY KEY   DEFAULT gen_random_uuid(),
    book_copy_id   UUID      NOT NULL REFERENCES book_copies (id),
    user_id        UUID      NOT NULL REFERENCES users (id),
    borrowed_at    TIMESTAMP NOT NULL DEFAULT now(),
    due_at         TIMESTAMP NOT NULL,
    returned_at    TIMESTAMP,
    extended_count INT       NOT NULL DEFAULT 0,
    created_at     TIMESTAMP NOT NULL DEFAULT now()
);

-- najczęstsze pytania do tej tabeli: "aktywne wypożyczenia usera" i "czy ten egzemplarz jest wypożyczony"
CREATE INDEX idx_loans_user_active ON loans (user_id, returned_at);
CREATE INDEX idx_loans_copy_active ON loans (book_copy_id, returned_at);