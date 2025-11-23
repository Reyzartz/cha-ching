package config

import (
	"os"
)

type Config struct {
	Database DatabaseConfig
	Server   ServerConfig
	Client   ClientConfig
}

type DatabaseConfig struct {
	Host     string
	User     string
	Password string
	DBName   string
	Port     string
}

type ServerConfig struct {
	Host string
	Port string
}

type ClientConfig struct {
	AllowedOrigins []string
}

func Load() (*Config, error) {
	return &Config{
		Database: DatabaseConfig{
			Host:     getEnv("POSTGRES_HOST", "localhost"),
			User:     getEnv("POSTGRES_USER", "postgres"),
			Password: getEnv("POSTGRES_PASSWORD", "postgres"),
			DBName:   getEnv("POSTGRES_DB", "chaching"),
			Port:     getEnv("POSTGRES_PORT", "5432"),
		},
		Server: ServerConfig{
			Host: getEnv("SERVER_HOST", "0.0.0.0"),
			Port: getEnv("SERVER_PORT", "8080"),
		},
		Client: ClientConfig{
			AllowedOrigins: []string{getEnv("CLIENT_ALLOWED_ORIGIN", "http://localhost:8081")},
		},
	}, nil
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
