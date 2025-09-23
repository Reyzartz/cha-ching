package store

import (
	"context"
	"database/sql"
)

type PaymentMethod struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type PaymentMethodStats struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
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
	ListPaymentMethods() ([]*PaymentMethod, error)
	PaymentMethodStats() ([]*PaymentMethodStats, error)
}

func (pg *PostgresPaymentMethodStore) CreatePaymentMethod(paymentMethod *PaymentMethod) (*PaymentMethod, error) {
	tx, err := pg.db.Begin()
	if err != nil {
		return nil, err
	}

	defer tx.Rollback()

	query := `
		INSERT INTO payment_methods (name)
		    VALUES ($1) 
		RETURNING id`

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	err = tx.QueryRowContext(ctx, query, paymentMethod.Name).Scan(&paymentMethod.ID)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return paymentMethod, nil
}

func (pg *PostgresPaymentMethodStore) ListPaymentMethods() ([]*PaymentMethod, error) {
	paymentMethods := []*PaymentMethod{}

	query := `
		SELECT pm.id, pm.name
		FROM payment_methods pm
		ORDER BY pm.id`

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	rows, err := pg.db.QueryContext(ctx, query)
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

func (pg *PostgresPaymentMethodStore) PaymentMethodStats() ([]*PaymentMethodStats, error) {
	paymentMethods := []*PaymentMethodStats{}

	query := `
	SELECT pm.id, pm.name, SUM(e.amount) as total_amount
	FROM payment_methods pm
	JOIN expenses e
	ON pm.id = e.payment_method_id
	GROUP BY pm.id, pm.name
	ORDER BY total_amount DESC`

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	rows, err := pg.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var paymentMethod PaymentMethodStats
		err := rows.Scan(&paymentMethod.ID, &paymentMethod.Name, &paymentMethod.TotalAmount)
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
