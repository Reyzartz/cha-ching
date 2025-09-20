package app

import (
	"cha-ching-server/internal/api"
	"cha-ching-server/internal/config"
	"cha-ching-server/internal/migrations"
	"cha-ching-server/internal/store"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
)

type Application struct {
	Logger               *log.Logger
	ExpenseHandler       *api.ExpenseHandler
	CategoryHandler      *api.CategoryHandler
	PaymentMethodHandler *api.PaymentMethodHandler
	Database             *sql.DB
}

func NewApplication(cfg *config.Config) (*Application, error) {
	db, err := store.Open(cfg)
	if err != nil {
		return nil, err
	}

	err = store.MigrateFS(db, migrations.FS, ".")
	if err != nil {
		panic(err)
	}

	logger := log.New(os.Stdout, "INFO: ", log.LstdFlags)

	expenseStore := store.NewPostgresExpenseStore(db)
	categoryStore := store.NewPostgresCategoryStore(db)
	paymentMethodStore := store.NewPostgresPaymentMethodStore(db)

	expenseHandler := api.NewExpenseHandler(logger, expenseStore)
	categoryHandler := api.NewCategoryHandler(logger, categoryStore)
	paymentMethodHandler := api.NewPaymentMethodHandler(logger, paymentMethodStore)

	app := &Application{
		Logger:               logger,
		ExpenseHandler:       expenseHandler,
		CategoryHandler:      categoryHandler,
		PaymentMethodHandler: paymentMethodHandler,
		Database:             db,
	}

	return app, nil
}

func (a *Application) HealthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Status: OK\n")
}
