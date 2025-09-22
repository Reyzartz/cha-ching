package store

import (
	"context"
	"database/sql"
)

type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type CategoryStat struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	TotalAmount float64 `json:"total_amount"`
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
	CategoryStats() ([]*CategoryStat, error)
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

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	err = tx.QueryRowContext(ctx, query, category.Name).Scan(&category.ID)
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

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	rows, err := pg.db.QueryContext(ctx, query)
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

func (pg *PostgresCategoryStore) CategoryStats() ([]*CategoryStat, error) {
	categoryStats := []*CategoryStat{}

	query := `
	SELECT c.id, c.name, SUM(e.amount) as total
	FROM categories c
	JOIN expenses e 
	ON c.id = e.category_id
	GROUP BY c.id, c.name
	`

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	rows, err := pg.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var categoryStat CategoryStat

		err := rows.Scan(
			&categoryStat.ID,
			&categoryStat.Name,
			&categoryStat.TotalAmount,
		)
		if err != nil {
			return nil, err
		}
		categoryStats = append(categoryStats, &categoryStat)
	}

	err = rows.Err()
	if err != nil {
		return nil, err
	}

	return categoryStats, nil
}
