ALTER TABLE settings
    ADD COLUMN description text NOT NULL DEFAULT '';

ALTER TABLE settings
    ALTER COLUMN description DROP DEFAULT;