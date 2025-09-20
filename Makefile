ifneq (,$(wildcard ./.env.development.local))
    	include .env.development.local
    	export
    endif
	
.PHONY: start-client start-server start

# Start the client application
start-client:
	cd client && bun start

# Start the client application
start-android:
	cd client && bun android

# Start the server application
start-server:
	cd server && go run main.go

# Start the server in development mode with auto-reload
start-dev-server:
	cd server && reflex -r '\.go$$' -s -- sh -c "go run main.go"

# Start both client and server concurrently
start:
	make start-server & make start-client

# Stop all running processes
stop:
	pkill -f "go run main.go" || true
	pkill -f "bun start" || true

.PHONY: docker-up docker-down

# Start Docker services
docker-up:
	docker-compose up --build

# Stop Docker services
docker-down:
	docker-compose down