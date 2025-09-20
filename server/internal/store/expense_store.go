package store

import (
	"database/sql"
)

type User struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type Expense struct {
	ID              int     `json:"id"`
	UserID          int     `json:"user_id"`
	CategoryID      int     `json:"category_id"`
	PaymentMethodID int     `json:"payment_method_id"`
	Title           string  `json:"title"`
	Amount          float64 `json:"amount"`
	ExpenseDate     string  `json:"expense_date"`
}

type ExpenseRelatedItems struct {
	Categories     map[int]*Category      `json:"categories"`
	PaymentMethods map[int]*PaymentMethod `json:"payment_methods"`
}

type PostgresExpenseStore struct {
	db *sql.DB
}

func NewPostgresExpenseStore(db *sql.DB) *PostgresExpenseStore {
	return &PostgresExpenseStore{
		db: db,
	}
}

type ExpenseStore interface {
	// User methods
	CreateUser(user *User) (*User, error)
	GetUserByID(id int64) (*User, error)

	// // Expense methods
	CreateExpense(expense *Expense) (*Expense, error)
	ListExpensesByUserID(userID int64) ([]*Expense, *ExpenseRelatedItems, error)
}

func (pg *PostgresExpenseStore) CreateUser(user *User) (*User, error) {
	tx, err := pg.db.Begin()
	if err != nil {
		return nil, err
	}

	defer tx.Rollback()

	query := `
		INSERT INTO users (name, email)
		    VALUES ($1, $2)
		RETURNING
		    id`

	err = tx.QueryRow(query, user.Name, user.Email).Scan(&user.ID)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (pg *PostgresExpenseStore) GetUserByID(id int64) (*User, error) {
	user := &User{}

	query := `
		SELECT u.id, u.name, u.email
		FROM users u
		WHERE u.id = $1`

	err := pg.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (pg *PostgresExpenseStore) CreateExpense(expense *Expense) (*Expense, error) {
	tx, err := pg.db.Begin()
	if err != nil {
		return nil, err
	}

	defer tx.Rollback()

	query := `
		INSERT INTO expenses (
			user_id,
			category_id,
			payment_method_id,
			title,
			amount,
			expense_date
		) VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING
		    ID`
	err = tx.QueryRow(query, expense.UserID, expense.CategoryID, expense.PaymentMethodID, expense.Title, expense.Amount, expense.ExpenseDate).Scan(&expense.ID)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return expense, nil
}

func (pg *PostgresExpenseStore) ListExpensesByUserID(userID int64) ([]*Expense, *ExpenseRelatedItems, error) {

	var expenses []*Expense
	var categories = make(map[int]*Category)
	var paymentMethods = make(map[int]*PaymentMethod)

	query := `
		SELECT 
			e.id, 
			e.user_id, 
			e.category_id,
			e.payment_method_id, 
			e.title,
			e.amount, 
			e.expense_date,
			c.id AS category_id,
			c.name AS category_name,
			p.id AS payment_method_id,
			p.name AS payment_method_name
		FROM expenses e
		LEFT JOIN categories c ON c.id = e.category_id
		LEFT JOIN payment_methods p ON p.id = e.payment_method_id
		WHERE e.user_id = $1
		ORDER BY e.expense_date DESC;
	`
	rows, err := pg.db.Query(query, userID)
	if err != nil {
		return nil, nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var expense Expense
		var category Category
		var paymentMethod PaymentMethod
		err := rows.Scan(
			&expense.ID,
			&expense.UserID,
			&expense.CategoryID,
			&expense.PaymentMethodID,
			&expense.Title,
			&expense.Amount,
			&expense.ExpenseDate,
			&category.ID,
			&category.Name,
			&paymentMethod.ID,
			&paymentMethod.Name,
		)
		if err != nil {
			return nil, nil, err
		}

		expenses = append(expenses, &expense)
		categories[category.ID] = &category
		paymentMethods[paymentMethod.ID] = &paymentMethod
	}

	if err = rows.Err(); err != nil {
		return nil, nil, err
	}

	return expenses, &ExpenseRelatedItems{
		Categories:     categories,
		PaymentMethods: paymentMethods,
	}, nil
}
