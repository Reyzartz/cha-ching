package routes

import (
	"cha-ching-server/internal/app"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func RegisterRoutes(app *app.Application) *chi.Mux {
	r := chi.NewMux()

	// Basic CORS configuration
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8081"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Health check endpoint
	r.Get("/health", app.HealthCheck)

	// User endpoints
	r.Post("/users", app.ExpenseHandler.HandleCreateUser)
	r.Get("/users/{id}", app.ExpenseHandler.HandleGetUser)

	// Category endpoints
	r.Post("/categories", app.ExpenseHandler.HandleCreateCategory)
	r.Get("/categories", app.ExpenseHandler.HandleGetAllCategories)

	// Payment method endpoints
	r.Post("/payment-methods", app.ExpenseHandler.HandleCreatePaymentMethod)
	r.Get("/payment-methods", app.ExpenseHandler.HandleGetAllPaymentMethods)

	// Expense endpoints
	r.Post("/expenses", app.ExpenseHandler.HandleCreateExpense)
	r.Get("/expenses", app.ExpenseHandler.HandleGetAllExpenses)
	return r
}
