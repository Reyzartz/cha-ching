# Cha-Ching

A modern expense tracking application with a React Native mobile app and Go backend.

## Prerequisites

- [Bun](https://bun.sh) for client development
- [Go](https://golang.org) for server development
- [Docker](https://www.docker.com) for the database

## Quick Start

1. Start the database:

   ```bash
   make docker-up
   ```

2. Install client dependencies:

   ```bash
   cd client
   bun install
   ```

3. Start the server:

   ```bash
   cd server
   go run main.go
   ```

4. Start the client:
   ```bash
   cd client
   bun start
   ```

## Development

### Running the Mobile App

- iOS: Press `i` in the terminal after starting the client
- Android: Press `a` in the terminal after starting the client
- Web: Press `w` in the terminal after starting the client

### All-in-One Command

To start both client and server together:

```bash
make start
```

To stop all running processes:

```bash
make stop
```

## Project Structure

```
cha-ching/
├── client/          # React Native/Expo mobile app
├── server/          # Go backend server
└── docker-compose.yml # Database configuration
```
