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
	r.Post("/categories", app.CategoryHandler.HandleCreateCategory)
	r.Get("/categories", app.CategoryHandler.HandleGetAllCategories)
	r.Get("/categories/stats", app.CategoryHandler.HandleGetCategoryStats)
	r.Put("/categories", app.CategoryHandler.HandleUpdateCategory)

	// Payment method endpoints
	r.Post("/payment-methods", app.PaymentMethodHandler.HandleCreatePaymentMethod)
	r.Get("/payment-methods", app.PaymentMethodHandler.HandleGetAllPaymentMethods)
	r.Get("/payment-methods/stats", app.PaymentMethodHandler.HandleGetPaymentMethodStats)

	// Expense endpoints
	r.Post("/expenses", app.ExpenseHandler.HandleCreateExpense)
	r.Get("/expenses", app.ExpenseHandler.HandleGetAllExpenses)
	r.Get("/expenses/stats/total-per-day", app.ExpenseHandler.HandleGetExpensesTotalPerDay)
	return r
}
