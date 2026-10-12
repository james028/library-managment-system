-- 007_create_settings.sql

CREATE TABLE settings
(
    key        text PRIMARY KEY,
    value      text        NOT NULL,
    type       text        NOT NULL
        CHECK (type IN ('int', 'decimal', 'bool', 'string')),
    updated_at timestamptz NOT NULL DEFAULT now(),
    updated_by uuid        REFERENCES users (id) ON DELETE SET NULL
);