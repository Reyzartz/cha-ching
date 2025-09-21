package store

import (
	"cha-ching-server/internal/utils"
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

type ExpenseQueryParams struct {
	Limit     *int
	Page      *int
	StartDate *string
	EndDate   *string
}

type ExpenseRelatedItems struct {
	Categories     map[int]*Category      `json:"categories"`
	PaymentMethods map[int]*PaymentMethod `json:"payment_methods"`
}

type ExpensePaginationData struct {
	TotalItems   int  `json:"total_items"`
	TotalPages   int  `json:"total_pages"`
	CurrentPage  int  `json:"current_page"`
	ItemsPerPage int  `json:"items_per_page"`
	NextPage     *int `json:"next_page"`
	PrevPage     *int `json:"prev_page"`
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
	ListExpensesByUserID(userID int64, queryParams ExpenseQueryParams) ([]*Expense, *ExpensePaginationData, *ExpenseRelatedItems, error)
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
func (pg *PostgresExpenseStore) ListExpensesByUserID(userID int64, queryParams ExpenseQueryParams) ([]*Expense, *ExpensePaginationData, *ExpenseRelatedItems, error) {
	var expenses []*Expense = []*Expense{}
	var categories = make(map[int]*Category)
	var paymentMethods = make(map[int]*PaymentMethod)

	// Get total count first
	countQuery := `
		SELECT COUNT(*) 
		FROM expenses e
		WHERE e.user_id = $1 AND
		($2::text IS NULL OR e.expense_date >= $2::timestamp) AND
		($3::text IS NULL OR e.expense_date <= $3::timestamp)
	`

	var totalItems int
	var startDate, endDate *string

	if queryParams.StartDate != nil {
		s := *queryParams.StartDate + " 00:00:00"
		startDate = &s
	}
	if queryParams.EndDate != nil {
		e := *queryParams.EndDate + " 23:59:59"
		endDate = &e
	}

	err := pg.db.QueryRow(countQuery, userID, startDate, endDate).Scan(&totalItems)
	if err != nil {
		return nil, nil, nil, err
	}

	// Calculate pagination data
	itemsPerPage := *queryParams.Limit
	totalPages := (totalItems + itemsPerPage - 1) / itemsPerPage
	currentPage := *queryParams.Page
	var nextPage, prevPage *int
	if currentPage+1 <= totalPages {
		nextPage = new(int)
		*nextPage = currentPage + 1
	}

	if currentPage-1 >= 1 {
		prevPage = new(int)
		*prevPage = currentPage - 1
	}

	paginationData := &ExpensePaginationData{
		TotalItems:   totalItems,
		TotalPages:   totalPages,
		CurrentPage:  currentPage,
		ItemsPerPage: itemsPerPage,
		NextPage:     nextPage,
		PrevPage:     prevPage,
	}

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
		WHERE e.user_id = $1 AND
		($2::text IS NULL OR e.expense_date >= $2::timestamp) AND
		($3::text IS NULL OR e.expense_date <= $3::timestamp)
		ORDER BY e.expense_date DESC
		LIMIT $4 OFFSET $5
	`

	offset := utils.GetOffset(queryParams.Page, queryParams.Limit)

	rows, err := pg.db.Query(
		query,
		userID,
		startDate,
		endDate,
		queryParams.Limit,
		offset,
	)

	if err != nil {
		return nil, nil, nil, err
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
			return nil, nil, nil, err
		}

		expenses = append(expenses, &expense)
		categories[category.ID] = &category
		paymentMethods[paymentMethod.ID] = &paymentMethod
	}

	if err = rows.Err(); err != nil {
		return nil, nil, nil, err
	}

	return expenses, paginationData, &ExpenseRelatedItems{
		Categories:     categories,
		PaymentMethods: paymentMethods,
	}, nil
}
