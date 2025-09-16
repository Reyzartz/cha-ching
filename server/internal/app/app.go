package app

import (
	"cha-ching-server/internal/api"
	"fmt"
	"log"
	"net/http"
	"os"
)

type Application struct {
	Logger         *log.Logger
	ExpenseHandler *api.ExpenseHandler
}

func NewApplication() (*Application, error) {
	logger := log.New(os.Stdout, "INFO: ", log.LstdFlags)

	expenseHandler := api.NewExpenseHandler(logger)

	app := &Application{
		Logger:         logger,
		ExpenseHandler: expenseHandler,
	}

	return app, nil
}

func (a *Application) HealthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Status: OK\n")
}
