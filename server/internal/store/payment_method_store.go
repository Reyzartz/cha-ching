package store

import (
	"cha-ching-server/internal/utils"
	"context"
	"database/sql"
)

type PaymentMethod struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	UserID int    `json:"-"`
}

type PaymentMethodStatsQueryParams struct {
	StartDate *string `schema:"start_date"`
	EndDate   *string `schema:"end_date"`
}

type PaymentMethodStats struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Count       int     `json:"count"`
	TotalAmount float64 `json:"total_amount"`
}

type PostgresPaymentMethodStore struct {
	db *sql.DB
}

func NewPostgresPaymentMethodStore(db *sql.DB) *PostgresPaymentMethodStore {
	return &PostgresPaymentMethodStore{
		db: db,
	}
}

type PaymentMethodStore interface {
	CreatePaymentMethod(paymentMethod *PaymentMethod) (*PaymentMethod, error)
	ListPaymentMethods(userID int) ([]*PaymentMethod, error)
	PaymentMethodStats(userID int, queryParams PaymentMethodStatsQueryParams) ([]*PaymentMethodStats, error)
}

func (pg *PostgresPaymentMethodStore) CreatePaymentMethod(paymentMethod *PaymentMethod) (*PaymentMethod, error) {
	tx, err := pg.db.Begin()
	if err != nil {
		return nil, err
	}

	defer tx.Rollback()

	query := `
		INSERT INTO payment_methods (user_id, name)
		    VALUES ($1, $2) 
		RETURNING id`

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	err = tx.QueryRowContext(ctx, query, paymentMethod.UserID, paymentMethod.Name).Scan(&paymentMethod.ID)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return paymentMethod, nil
}

func (pg *PostgresPaymentMethodStore) ListPaymentMethods(userID int) ([]*PaymentMethod, error) {
	paymentMethods := []*PaymentMethod{}

	query := `
		SELECT pm.id, pm.name
		FROM payment_methods pm
		WHERE pm.user_id = $1
		ORDER BY pm.id`

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	rows, err := pg.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var paymentMethod PaymentMethod
		err := rows.Scan(&paymentMethod.ID, &paymentMethod.Name)
		if err != nil {
			return nil, err
		}
		paymentMethods = append(paymentMethods, &paymentMethod)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return paymentMethods, nil
}

func (pg *PostgresPaymentMethodStore) PaymentMethodStats(userID int, queryParams PaymentMethodStatsQueryParams) ([]*PaymentMethodStats, error) {
	paymentMethods := []*PaymentMethodStats{}

	query := `
	SELECT pm.id, pm.name, COALESCE(SUM(e.amount), 0) as total_amount, COUNT(e.id) as count
	FROM payment_methods pm
	LEFT JOIN expenses e
	ON pm.id = e.payment_method_id
		AND e.user_id = $1 
		AND ($2::text IS NULL OR e.expense_date >= ($2::timestamp AT TIME ZONE 'Asia/Kolkata')) 
		AND ($3::text IS NULL OR e.expense_date <= ($3::timestamp AT TIME ZONE 'Asia/Kolkata')) 
	WHERE 
		pm.user_id = $1 
	GROUP BY pm.id, pm.name
	ORDER BY total_amount DESC`

	startDate, endDate := utils.FormatStartEndDate(queryParams.StartDate, queryParams.EndDate)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	rows, err := pg.db.QueryContext(ctx, query, userID, startDate, endDate)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var paymentMethod PaymentMethodStats
		err := rows.Scan(
			&paymentMethod.ID,
			&paymentMethod.Name,
			&paymentMethod.TotalAmount,
			&paymentMethod.Count,
		)
		if err != nil {
			return nil, err
		}
		paymentMethods = append(paymentMethods, &paymentMethod)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return paymentMethods, nil
}
