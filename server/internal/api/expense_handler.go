package api

import (
	"encoding/json"
	"log"
	"net/http"
)

type ExpenseHandler struct {
	logger *log.Logger
}

func NewExpenseHandler(logger *log.Logger) *ExpenseHandler {
	return &ExpenseHandler{
		logger,
	}
}

func (eh *ExpenseHandler) HandleGetAllExpenses(w http.ResponseWriter, r *http.Request) {

	js, err := json.MarshalIndent(map[string]interface{}{
		"data": []map[string]interface{}{
			{"name": "Some thing", "amount": 2000, "category": "to expensive", "date": "2025-07-06T18:39:29.401Z"},
			{"name": "Lunch", "amount": 200, "category": "Food", "date": "2025-07-06T18:50:54.780Z"},
			{"name": "mae", "amount": 200, "category": "Cat", "date": "2025-07-14T19:39:56.748Z"},
			{"name": "too bloody expensive", "amount": 2000, "category": "open man", "date": "2025-09-16T20:05:56.703Z"},
		},
	}, "", "  ")

	if err != nil {
		eh.logger.Printf("Error marshalling expenses: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	js = append(js, '\n')

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
	w.Write(js)

	eh.logger.Printf("Returned all expenses")

}
