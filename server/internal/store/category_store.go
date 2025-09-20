package store

import "database/sql"

type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type PostgresCategoryStore struct {
	db *sql.DB
}

func NewPostgresCategoryStore(db *sql.DB) *PostgresCategoryStore {
	return &PostgresCategoryStore{
		db: db,
	}
}

type CategoryStore interface {
	CreateCategory(category *Category) (*Category, error)
	ListCategories() ([]*Category, error)
}

func (pg *PostgresCategoryStore) CreateCategory(category *Category) (*Category, error) {
	tx, err := pg.db.Begin()
	if err != nil {
		return nil, err
	}

	defer tx.Rollback()

	query := `
		INSERT INTO categories (name)
		    VALUES ($1)
		RETURNING
		    id`

	err = tx.QueryRow(query, category.Name).Scan(&category.ID)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return category, nil
}

func (pg *PostgresCategoryStore) ListCategories() ([]*Category, error) {
	categories := []*Category{}

	query := `
		SELECT c.id, c.name
		FROM categories c
		ORDER BY c.id`

	rows, err := pg.db.Query(query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var category Category
		err := rows.Scan(&category.ID, &category.Name)
		if err != nil {
			return nil, err
		}
		categories = append(categories, &category)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return categories, nil
}
