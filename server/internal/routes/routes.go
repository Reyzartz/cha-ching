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

	r.Get("/health", app.HealthCheck)
	r.Get("/expenses", app.ExpenseHandler.HandleGetAllExpenses)

	return r
}
