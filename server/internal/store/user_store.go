package store

import (
	"context"
	"database/sql"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type password struct {
	hash []byte
}

func (p *password) Set(plainTextPassword string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(plainTextPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	p.hash = hash
	return nil
}

func (p *password) Matches(plainTextPassword string) (bool, error) {
	err := bcrypt.CompareHashAndPassword(p.hash, []byte(plainTextPassword))

	if err != nil {
		switch {
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
			return false, nil
		default:
			return false, err
		}
	}

	return true, nil
}

type User struct {
	ID           int      `json:"id"`
	Name         string   `json:"name"`
	Email        string   `json:"email"`
	PasswordHash password `json:"-"`
}

type PostgresUserStore struct {
	db *sql.DB
}

func NewPostgresUserStore(db *sql.DB) *PostgresUserStore {
	return &PostgresUserStore{
		db: db,
	}
}

type UserStore interface {
	CreateUser(user *User) (*User, error)
	GetUserByEmail(email string) (*User, error)
}

func (pg *PostgresUserStore) CreateUser(user *User) (*User, error) {
	tx, err := pg.db.Begin()
	if err != nil {
		return nil, err
	}

	defer tx.Rollback()

	query := `
		INSERT INTO users (name, email, password_hash)
		    VALUES ($1, $2, $3)
		RETURNING
		    id`

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	err = tx.QueryRowContext(
		ctx,
		query,
		user.Name,
		user.Email,
		user.PasswordHash.hash,
	).Scan(&user.ID)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (pg *PostgresUserStore) GetUserByEmail(email string) (*User, error) {
	user := &User{}

	query := `
		SELECT u.id, u.name, u.email, u.password_hash
		FROM users u
		WHERE u.email = $1`

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	err := pg.db.QueryRowContext(ctx, query, email).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash.hash,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return user, nil
}
