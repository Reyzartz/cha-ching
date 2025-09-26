package store

import (
	"cha-ching-server/internal/utils"
	"context"
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

type ExpenseTotalPerDay struct {
	ExpenseDate string  `json:"expense_date"`
	Count       int     `json:"count"`
	TotalAmount float64 `json:"total_amount"`
}

type ExpenseQueryParams struct {
	Limit           *int    `schema:"limit"`
	Page            *int    `schema:"page"`
	StartDate       *string `schema:"start_date"`
	EndDate         *string `schema:"end_date"`
	CategoryID      *int    `schema:"category_id"`
	PaymentMethodID *int    `schema:"payment_method_id"`
}

type ExpenseTotalPerDayQueryParams struct {
	StartDate       *string `schema:"start_date"`
	EndDate         *string `schema:"end_date"`
	CategoryID      *int    `schema:"category_id"`
	PaymentMethodID *int    `schema:"payment_method_id"`
}

type ExpenseRelatedItems struct {
	Categories     map[int]*Category      `json:"categories"`
	PaymentMethods map[int]*PaymentMethod `json:"payment_methods"`
}

type ExpenseMetaItems struct {
	TotalAmount float64 `json:"total_amount"`
	TotalCount  int     `json:"total_count"`
}

type ExpensePaginationData struct {
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
	ListExpensesByUserID(userID int64, queryParams ExpenseQueryParams) ([]*Expense, *ExpensePaginationData, *ExpenseRelatedItems, *ExpenseMetaItems, error)
	ListExpensesTotalPerDay(userID int64, queryParams ExpenseTotalPerDayQueryParams) ([]*ExpenseTotalPerDay, *ExpenseMetaItems, error)
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

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	err = tx.QueryRowContext(ctx, query, user.Name, user.Email).Scan(&user.ID)
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

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	err := pg.db.QueryRowContext(ctx, query, id).Scan(
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
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	err = tx.QueryRowContext(ctx, query, expense.UserID, expense.CategoryID, expense.PaymentMethodID, expense.Title, expense.Amount, expense.ExpenseDate).Scan(&expense.ID)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return expense, nil
}

func (pg *PostgresExpenseStore) ListExpensesByUserID(userID int64, queryParams ExpenseQueryParams) (
	[]*Expense,
	*ExpensePaginationData,
	*ExpenseRelatedItems,
	*ExpenseMetaItems,
	error,
) {
	var expenses []*Expense = []*Expense{}
	var categories = make(map[int]*Category)
	var paymentMethods = make(map[int]*PaymentMethod)

	metaItems, err := pg.GetExpenseMetaItems(userID, queryParams)
	if err != nil {
		return nil, nil, nil, nil, err
	}

	startDate, endDate := utils.FormatStartEndDate(queryParams.StartDate, queryParams.EndDate)

	limit := 10
	if queryParams.Limit != nil {
		limit = *queryParams.Limit
	}

	page := 1
	if queryParams.Page != nil {
		page = *queryParams.Page
	}

	// Calculate pagination data
	itemsPerPage := limit
	totalPages := (metaItems.TotalCount + itemsPerPage - 1) / itemsPerPage
	currentPage := page
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
		($2::text IS NULL OR e.expense_date >= ($2::timestamp AT TIME ZONE 'Asia/Kolkata')) AND
		($3::text IS NULL OR e.expense_date <= ($3::timestamp AT TIME ZONE 'Asia/Kolkata')) AND
		($4::int IS NULL OR e.category_id = $4) AND
		($5::int IS NULL OR e.payment_method_id = $5)
		ORDER BY e.expense_date DESC
		LIMIT $6 OFFSET $7
	`

	offset := utils.GetOffset(queryParams.Page, queryParams.Limit)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	rows, err := pg.db.QueryContext(
		ctx,
		query,
		userID,
		startDate,
		endDate,
		queryParams.CategoryID,
		queryParams.PaymentMethodID,
		queryParams.Limit,
		offset,
	)

	if err != nil {
		return nil, nil, nil, nil, err
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
			return nil, nil, nil, nil, err
		}

		expenses = append(expenses, &expense)
		categories[category.ID] = &category
		paymentMethods[paymentMethod.ID] = &paymentMethod
	}

	if err = rows.Err(); err != nil {
		return nil, nil, nil, nil, err
	}

	return expenses, paginationData, &ExpenseRelatedItems{
		Categories:     categories,
		PaymentMethods: paymentMethods,
	}, metaItems, nil
}

func (pg *PostgresExpenseStore) GetExpenseMetaItems(userID int64, queryParams ExpenseQueryParams) (*ExpenseMetaItems, error) {
	var metaItems = ExpenseMetaItems{}

	// Get total count first
	query := `
		SELECT COUNT(*), COALESCE(SUM(e.amount), 0) AS total_amount
		FROM expenses e
		WHERE e.user_id = $1 AND
		($2::text IS NULL OR e.expense_date >= ($2::timestamp AT TIME ZONE 'Asia/Kolkata')) AND
		($3::text IS NULL OR e.expense_date <= ($3::timestamp AT TIME ZONE 'Asia/Kolkata')) AND
		($4::int IS NULL OR e.category_id = $4) AND
		($5::int IS NULL OR e.payment_method_id = $5)
	`

	startDate, endDate := utils.FormatStartEndDate(queryParams.StartDate, queryParams.EndDate)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	err := pg.db.QueryRowContext(
		ctx,
		query,
		userID,
		startDate,
		endDate,
		queryParams.CategoryID,
		queryParams.PaymentMethodID).Scan(&metaItems.TotalCount, &metaItems.TotalAmount)
	if err != nil {
		return nil, err
	}

	return &metaItems, nil
}

func (pg *PostgresExpenseStore) ListExpensesTotalPerDay(userID int64, queryParams ExpenseTotalPerDayQueryParams) ([]*ExpenseTotalPerDay, *ExpenseMetaItems, error) {
	var expenseTotalPerDays []*ExpenseTotalPerDay = []*ExpenseTotalPerDay{}
	metaItems, err := pg.GetExpenseMetaItems(userID, ExpenseQueryParams{
		StartDate:       queryParams.StartDate,
		EndDate:         queryParams.EndDate,
		CategoryID:      queryParams.CategoryID,
		PaymentMethodID: queryParams.PaymentMethodID,
	})
	if err != nil {
		return nil, nil, err
	}

	startDate, endDate := utils.FormatStartEndDate(queryParams.StartDate, queryParams.EndDate)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	query := `
	SELECT 
		TO_CHAR((e.expense_date AT TIME ZONE 'Asia/Kolkata'), 'YYYY-MM-DD') AS formatted_date,
		SUM(e.amount) AS total_amount,
		COUNT(e.id) AS count
	FROM expenses e
	WHERE 
		e.user_id = $1 AND
		($2::text IS NULL OR e.expense_date >= ($2::timestamp AT TIME ZONE 'Asia/Kolkata')) AND
		($3::text IS NULL OR e.expense_date <= ($3::timestamp AT TIME ZONE 'Asia/Kolkata')) AND
		($4::int IS NULL OR e.category_id = $4) AND
		($5::int IS NULL OR e.payment_method_id = $5)
	GROUP BY formatted_date
	ORDER BY formatted_date
	`

	rows, err := pg.db.QueryContext(
		ctx,
		query,
		userID,
		startDate,
		endDate,
		queryParams.CategoryID,
		queryParams.PaymentMethodID,
	)

	if err != nil {
		return nil, nil, err
	}

	for rows.Next() {
		var expenseTotalPerDay ExpenseTotalPerDay

		err = rows.Scan(&expenseTotalPerDay.ExpenseDate, &expenseTotalPerDay.TotalAmount, &expenseTotalPerDay.Count)
		if err != nil {
			return nil, nil, err
		}

		expenseTotalPerDays = append(expenseTotalPerDays, &expenseTotalPerDay)
	}

	err = rows.Err()

	if err != nil {
		return nil, nil, err
	}

	return expenseTotalPerDays, metaItems, nil
}
