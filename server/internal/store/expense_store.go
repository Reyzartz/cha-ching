package store

import (
	"cha-ching-server/internal/utils"
	"context"
	"database/sql"
	"fmt"
)

type Expense struct {
	ID              int     `json:"id"`
	UserID          int     `json:"-"`
	CategoryID      int     `json:"category_id"`
	PaymentMethodID int     `json:"payment_method_id"`
	Title           string  `json:"title"`
	Amount          float64 `json:"amount"`
	ExpenseDate     string  `json:"expense_date"`
	CreatedAt       string  `json:"-"`
	UpdatedAt       string  `json:"-"`
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
	CreateExpense(expense *Expense) (*Expense, error)
	UpdateExpense(id int64, expense *Expense) (*Expense, error)
	ListExpensesByUserID(userID int, queryParams ExpenseQueryParams) ([]*Expense, *ExpensePaginationData, *ExpenseRelatedItems, *ExpenseMetaItems, error)
	ListExpensesTotalPerDay(userID int, queryParams ExpenseTotalPerDayQueryParams) ([]*ExpenseTotalPerDay, *ExpenseMetaItems, error)
	SearchExpensesByTitle(userID int, title string) ([]*Expense, *ExpenseRelatedItems, error)
}

func (pg *PostgresExpenseStore) CreateExpense(expense *Expense) (*Expense, error) {
	tx, err := pg.db.Begin()
	if err != nil {
		return nil, err
	}

	defer tx.Rollback()

	// Verify if the category exists for the user
	var categoryExists bool
	categoryQuery := `
		SELECT EXISTS (
			SELECT 1 
			FROM categories 
			WHERE id = $1 AND user_id = $2
		)
	`
	err = tx.QueryRow(categoryQuery, expense.CategoryID, expense.UserID).Scan(&categoryExists)
	if err != nil {
		return nil, err
	}

	if !categoryExists {
		return nil, fmt.Errorf("category does not exist for the user")
	}

	// Verify if the payment method exists for the user
	var paymentMethodExists bool
	paymentMethodQuery := `
		SELECT EXISTS (
			SELECT 1 
			FROM payment_methods 
			WHERE id = $1 AND user_id = $2
		)
	`
	err = tx.QueryRow(paymentMethodQuery, expense.PaymentMethodID, expense.UserID).Scan(&paymentMethodExists)
	if err != nil {
		return nil, err
	}

	if !paymentMethodExists {
		return nil, fmt.Errorf("payment method does not exist for the user")
	}

	// Insert the expense
	query := `
		INSERT INTO expenses (
			user_id,
			category_id,
			payment_method_id,
			title,
			amount,
			expense_date
		) VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING ID
	`

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

func (pg *PostgresExpenseStore) UpdateExpense(id int64, expense *Expense) (*Expense, error) {
	query := `
	UPDATE expenses
	SET 
		category_id = $1, 
		payment_method_id = $2, 
		title = $3,
		amount = $4,
		expense_date = $5
	WHERE id = $6 AND user_id = $7
	RETURNING id
	`

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	err := pg.db.QueryRowContext(
		ctx,
		query,
		expense.CategoryID,
		expense.PaymentMethodID,
		expense.Title,
		expense.Amount,
		expense.ExpenseDate,
		id,
		expense.UserID,
	).Scan(&expense.ID)
	if err == sql.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	return expense, nil
}

func (pg *PostgresExpenseStore) ListExpensesByUserID(userID int, queryParams ExpenseQueryParams) (
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
		LEFT JOIN categories c ON c.id = e.category_id AND c.user_id = $1
		LEFT JOIN payment_methods p ON p.id = e.payment_method_id AND p.user_id = $1
		WHERE 
			e.user_id = $1  AND 
			($2::text IS NULL OR e.expense_date >= ($2::timestamp AT TIME ZONE 'Asia/Kolkata')) AND
			($3::text IS NULL OR e.expense_date <= ($3::timestamp AT TIME ZONE 'Asia/Kolkata')) AND
			($4::int IS NULL OR e.category_id = $4) AND
			($5::int IS NULL OR e.payment_method_id = $5)
		ORDER BY e.expense_date DESC, e.created_at DESC
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

func (pg *PostgresExpenseStore) GetExpenseMetaItems(userID int, queryParams ExpenseQueryParams) (*ExpenseMetaItems, error) {
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

func (pg *PostgresExpenseStore) ListExpensesTotalPerDay(userID int, queryParams ExpenseTotalPerDayQueryParams) ([]*ExpenseTotalPerDay, *ExpenseMetaItems, error) {
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

func (pg *PostgresExpenseStore) SearchExpensesByTitle(userID int, title string) ([]*Expense, *ExpenseRelatedItems, error) {
	var expenses []*Expense = []*Expense{}
	var categories = make(map[int]*Category)
	var paymentMethods = make(map[int]*PaymentMethod)

	query := `
			SELECT DISTINCT ON (e.title)
				e.id, 
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
			LEFT JOIN categories c ON c.id = e.category_id AND c.user_id = $1
			LEFT JOIN payment_methods p ON p.id = e.payment_method_id AND p.user_id = $1
			WHERE 
				e.user_id = $1
				AND e.title ILIKE '%' || $2 || '%'

			ORDER BY 
				e.title,
				e.expense_date DESC,
				e.created_at DESC
	`
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	rows, err := pg.db.QueryContext(
		ctx,
		query,
		userID,
		title,
	)

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
