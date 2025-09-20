package store

import "database/sql"

type PaymentMethod struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
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

	err = tx.QueryRow(query, paymentMethod.Name).Scan(&paymentMethod.ID)
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

	rows, err := pg.db.Query(query)
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
