CREATE TYPE member_status AS ENUM (
    'ACTIVE',
    'BLOCKED'
    );

CREATE TABLE members (
                         id           SERIAL PRIMARY KEY,

                         user_id      UUID NOT NULL UNIQUE,

                         card_number  TEXT NOT NULL UNIQUE,
                         status       member_status NOT NULL DEFAULT 'ACTIVE',

                         created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                         updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

                         CONSTRAINT fk_members_user
                             FOREIGN KEY (user_id)
                                 REFERENCES users (id)
                                 ON DELETE CASCADE
);

