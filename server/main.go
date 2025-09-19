package main

import (
	"cha-ching-server/internal/app"
	"cha-ching-server/internal/config"
	"cha-ching-server/internal/routes"
	"fmt"
	"net/http"
	"strconv"
	"time"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		panic(err)
	}

	app, err := app.NewApplication(cfg)
	if err != nil {
		panic(err)
	}

	defer app.Database.Close()

	port, _ := strconv.Atoi(cfg.Server.Port)
	app.Logger.Printf("Starting server on %s:%d", cfg.Server.Host, port)

	Start(app, cfg)
}

func Start(app *app.Application, cfg *config.Config) {
	r := routes.RegisterRoutes(app)
	port, _ := strconv.Atoi(cfg.Server.Port)

	server := &http.Server{
		Addr:         fmt.Sprintf("%s:%d", cfg.Server.Host, port),
		Handler:      r,
		IdleTimeout:  time.Minute,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	app.Logger.Printf("Listing on port %d", port)

	err := server.ListenAndServe()

	if err != nil {
		panic(err)
	}

}
