FROM golang:1.25.3-alpine3.22 AS builder

WORKDIR /home/app/server

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN  CGO_ENABLED=0 GOOS=linux go build -o cha-ching-server ./main.go

FROM alpine:3.22

WORKDIR /app
COPY --from=builder /home/app/server/cha-ching-server .

EXPOSE ${SERVER_PORT}

CMD ["./cha-ching-server"]
