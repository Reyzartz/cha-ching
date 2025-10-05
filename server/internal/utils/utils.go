package utils

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/gorilla/schema"
)

type Envelope map[string]interface{}

func WriteJSONResponse(w http.ResponseWriter, status int, data Envelope) error {
	js, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	js = append(js, '\n')

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(js)

	return nil
}

func ReadRequestBody(r *http.Request, dst interface{}) error {
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	return dec.Decode(dst)
}

func ReadIDParam(r *http.Request) (int64, error) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		return 0, errors.New("invalid id parameter")
	}

	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		return 0, errors.New("invalid id parameter")
	}

	return id, nil
}

func ReadIntQueryParam(r *http.Request, key string, defaultValue int) (int, error) {
	param := r.URL.Query().Get(key)
	if param == "" {
		return defaultValue, nil
	}
	value, err := strconv.Atoi(param)
	if err != nil {
		return 0, err
	}
	return value, nil
}

func ReadStringQueryParam(r *http.Request, key string, defaultValue string) (string, error) {
	param := r.URL.Query().Get(key)
	if param == "" {
		return defaultValue, nil
	}
	return param, nil
}

func ReadDateStringQueryParam(r *http.Request, key string, defaultValue string) (string, error) {
	param := r.URL.Query().Get(key)
	if param == "" {
		return defaultValue, nil
	}
	_, err := time.Parse("2006-01-02", param)
	if err != nil {
		return "", err
	}
	return param, nil
}

func GetOffset(page *int, limit *int) int {
	if page == nil || limit == nil || *page <= 1 {
		return 0
	}
	return (*page - 1) * *limit
}
func QueryParamsDecoder[T any](r *http.Request, dst *T) error {
	decoder := schema.NewDecoder()
	decoder.IgnoreUnknownKeys(true)

	err := decoder.Decode(dst, r.URL.Query())
	if err != nil {
		return err
	}

	return nil
}

func FormatStartEndDate(startDate, endDate *string) (formattedStart, formattedEnd *string) {
	if startDate != nil {
		s := *startDate + " 00:00:00.000+05:30"
		formattedStart = &s
	}
	if endDate != nil {
		e := *endDate + " 23:59:59+05:30"
		formattedEnd = &e
	}
	return
}

func ExtractTokenFromHeader(authHeader string) (string, error) {
	const prefix = "Bearer "
	if len(authHeader) < len(prefix) || authHeader[:len(prefix)] != prefix {
		return "", errors.New("invalid authorization header format")
	}

	return authHeader[len(prefix):], nil
}
