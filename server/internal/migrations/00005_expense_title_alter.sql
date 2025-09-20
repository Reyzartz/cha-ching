-- +goose Up
-- +goose StatementBegin
ALTER TABLE
    expenses
ADD
    COLUMN title VARCHAR(150) NOT NULL DEFAULT 'Untitled Expense';

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
ALTER TABLE
    expenses DROP COLUMN title;

-- +goose StatementEnd