-- 005_create_reservations.sql

CREATE TYPE reservation_status AS ENUM ('pending', 'fulfilled', 'cancelled', 'expired');

CREATE TABLE reservations (
                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              book_id UUID NOT NULL REFERENCES books(id),
                              user_id UUID NOT NULL REFERENCES users(id),
                              reserved_at TIMESTAMP NOT NULL DEFAULT now(),
                              expires_at TIMESTAMP NOT NULL,
                              status reservation_status NOT NULL DEFAULT 'pending'
);

CREATE INDEX idx_reservations_user ON reservations (user_id);
CREATE INDEX idx_reservations_book_status ON reservations (book_id, status);