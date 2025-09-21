package utils

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
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
