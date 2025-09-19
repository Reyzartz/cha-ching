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
	Logger         *log.Logger
	ExpenseHandler *api.ExpenseHandler
	Database       *sql.DB
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

	store := store.NewPostgresExpenseStore(db)

	expenseHandler := api.NewExpenseHandler(logger, store)

	app := &Application{
		Logger:         logger,
		ExpenseHandler: expenseHandler,
		Database:       db,
	}

	return app, nil
}

func (a *Application) HealthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Status: OK\n")
}
