package app

import (
	"cha-ching-server/internal/api"
	"cha-ching-server/internal/config"
	"cha-ching-server/internal/middleware"
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
	UserHandler          *api.UserHandler
	TokenHandler         *api.TokenHandler
	UserMiddleware       *middleware.UserMiddleware
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

	userStore := store.NewPostgresUserStore(db)
	expenseStore := store.NewPostgresExpenseStore(db)
	categoryStore := store.NewPostgresCategoryStore(db)
	paymentMethodStore := store.NewPostgresPaymentMethodStore(db)
	tokenStore := store.NewPostgresTokenStore(db)

	userHandler := api.NewUserHandler(logger, userStore)
	expenseHandler := api.NewExpenseHandler(logger, expenseStore)
	categoryHandler := api.NewCategoryHandler(logger, categoryStore)
	paymentMethodHandler := api.NewPaymentMethodHandler(logger, paymentMethodStore)
	tokenHandler := api.NewTokenHandler(logger, tokenStore, userStore)

	userMiddleware := middleware.NewUserMiddleware(userStore)

	app := &Application{
		Logger:               logger,
		ExpenseHandler:       expenseHandler,
		CategoryHandler:      categoryHandler,
		PaymentMethodHandler: paymentMethodHandler,
		UserHandler:          userHandler,
		TokenHandler:         tokenHandler,
		UserMiddleware:       userMiddleware,
		Database:             db,
	}

	return app, nil
}

func (a *Application) HealthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Status: OK\n")
}
