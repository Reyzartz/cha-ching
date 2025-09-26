package store

import (
	"cha-ching-server/internal/utils"
	"context"
	"database/sql"
)

type Category struct {
	ID     int     `json:"id"`
	Name   string  `json:"name"`
	Budget float64 `json:"budget"`
}

type CategoryStat struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Count       int     `json:"count"`
	Budget      float64 `json:"budget"`
	TotalAmount float64 `json:"total_amount"`
}

type CategoryStatQueryParams struct {
	StartDate *string `schema:"start_date"`
	EndDate   *string `schema:"end_date"`
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
	UpdateCategory(category *Category) (*Category, error)
	ListCategories() ([]*Category, error)
	CategoryStats(queryParams CategoryStatQueryParams) ([]*CategoryStat, error)
}

func (pg *PostgresCategoryStore) CreateCategory(category *Category) (*Category, error) {
	tx, err := pg.db.Begin()
	if err != nil {
		return nil, err
	}

	defer tx.Rollback()

	query := `
		INSERT INTO categories (name, budget)
		    VALUES ($1, $2)
		RETURNING
		    id`

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	err = tx.QueryRowContext(ctx, query, category.Name, category.Budget).Scan(&category.ID)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return category, nil
}

func (pg *PostgresCategoryStore) UpdateCategory(category *Category) (*Category, error) {
	tx, err := pg.db.Begin()
	if err != nil {
		return nil, err
	}

	defer tx.Rollback()

	query := `
	UPDATE categories
	SET	name=$1 , budget=$2
	WHERE id=$3
	RETURNING id
	`
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	err = tx.QueryRowContext(
		ctx,
		query,
		category.Name,
		category.Budget,
		category.ID,
	).Scan(&category.ID)
	if err == sql.ErrNoRows {
		return nil, nil
	}

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
		SELECT c.id, c.name, c.budget
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
		err := rows.Scan(&category.ID, &category.Name, &category.Budget)
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

func (pg *PostgresCategoryStore) CategoryStats(queryParams CategoryStatQueryParams) ([]*CategoryStat, error) {
	categoryStats := []*CategoryStat{}

	query := `
	SELECT c.id, c.name, c.budget, COALESCE(SUM(e.amount), 0) as total_amount, COUNT(e.id) as count
	FROM categories c
	LEFT JOIN expenses e 
	ON c.id = e.category_id
	WHERE 
		($1::text IS NULL OR e.expense_date >= ($1::timestamp AT TIME ZONE 'Asia/Kolkata')) AND
		($2::text IS NULL OR e.expense_date <= ($2::timestamp AT TIME ZONE 'Asia/Kolkata')) 
	GROUP BY c.id, c.name, c.budget
	ORDER BY total_amount DESC`

	startDate, endDate := utils.FormatStartEndDate(queryParams.StartDate, queryParams.EndDate)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	rows, err := pg.db.QueryContext(ctx, query, startDate, endDate)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var categoryStat CategoryStat

		err := rows.Scan(
			&categoryStat.ID,
			&categoryStat.Name,
			&categoryStat.Budget,
			&categoryStat.TotalAmount,
			&categoryStat.Count,
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
