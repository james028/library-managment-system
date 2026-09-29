-- 006_create_fines.sql

CREATE TABLE fines (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       loan_id UUID NOT NULL REFERENCES loans(id),
                       amount NUMERIC(10, 2) NOT NULL,
                       paid BOOLEAN NOT NULL DEFAULT false,
                       created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_fines_loan_id ON fines (loan_id);
CREATE INDEX idx_fines_paid ON fines (paid);