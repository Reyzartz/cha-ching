-- +goose Up
-- +goose StatementBegin
ALTER TABLE
    categories
ADD
    COLUMN user_id BIGINT REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE
    payment_methods
ADD
    COLUMN user_id BIGINT REFERENCES users (id) ON DELETE CASCADE;

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
ALTER TABLE
    categories DROP COLUMN user_id;

ALTER TABLE
    payment_methods DROP COLUMN user_id;

-- +goose StatementEnd