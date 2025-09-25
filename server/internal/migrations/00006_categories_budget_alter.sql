-- +goose Up
-- +goose StatementBegin
ALTER TABLE
    categories
ADD
    COLUMN budget DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
ALTER TABLE
    categories DROP COLUMN budget;

-- +goose StatementEnd