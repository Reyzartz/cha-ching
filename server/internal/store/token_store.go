package store

import (
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/base32"
	"time"
)

type Token struct {
	TokenString string    `json:"token"`
	Hash        []byte    `json:"-"`
	Expiry      time.Time `json:"expiry"`
	UserID      int       `json:"-"`
}

func GenerateToken(userID int, ttl time.Duration) (*Token, error) {
	token := &Token{
		UserID: userID,
		Expiry: time.Now().Add(ttl),
	}

	emptyBytes := make([]byte, 32)
	_, err := rand.Read(emptyBytes)
	if err != nil {
		return nil, err
	}

	token.TokenString = base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(emptyBytes)
	hash := sha256.Sum256([]byte(token.TokenString))
	token.Hash = hash[:]
	return token, nil
}

type PostgresTokenStore struct {
	db *sql.DB
}

func NewPostgresTokenStore(db *sql.DB) *PostgresTokenStore {
	return &PostgresTokenStore{db: db}
}

type TokenStore interface {
	Insert(token *Token) error
	CreateNewToken(userId int, ttl time.Duration) (*Token, error)
	DeleteAllTokensForUser(userId int) error
}

func (s *PostgresTokenStore) Insert(token *Token) error {
	query := `
		INSERT INTO tokens (hash, user_id, expiry)
		VALUES ($1, $2, $3)
	`
	_, err := s.db.Exec(query, token.Hash, token.UserID, token.Expiry)
	return err
}

func (s *PostgresTokenStore) CreateNewToken(userId int, ttl time.Duration) (*Token, error) {
	token, err := GenerateToken(userId, ttl)
	if err != nil {
		return nil, err
	}

	err = s.Insert(token)
	return token, err
}

func (s *PostgresTokenStore) DeleteAllTokensForUser(userId int) error {
	query := `
		DELETE FROM tokens
		WHERE user_id = $1
	`
	_, err := s.db.Exec(query, userId)
	return err
}
