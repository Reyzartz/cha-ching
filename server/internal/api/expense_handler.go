package api

import (
	"cha-ching-server/internal/middleware"
	"cha-ching-server/internal/store"
	"cha-ching-server/internal/utils"
	"log"
	"net/http"
)

type ExpenseHandler struct {
	logger       *log.Logger
	expenseStore store.ExpenseStore
}

func NewExpenseHandler(logger *log.Logger, expenseStore store.ExpenseStore) *ExpenseHandler {
	return &ExpenseHandler{
		logger,
		expenseStore,
	}
}

func (eh *ExpenseHandler) HandleCreateExpense(w http.ResponseWriter, r *http.Request) {
	var expense store.Expense

	err := utils.ReadRequestBody(r, &expense)
	if err != nil {
		eh.logger.Printf("ERROR: decoding create expense request body: %v", err)
		utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": "invalid request body"})
		return
	}

	user := middleware.GetUser(r)
	expense.UserID = user.ID

	createdExpense, err := eh.expenseStore.CreateExpense(&expense)
	if err != nil {
		eh.logger.Printf("ERROR: CreateExpense: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusCreated, utils.Envelope{
		"data": createdExpense,
	})
}

func (eh *ExpenseHandler) HandleUpdateExpense(w http.ResponseWriter, r *http.Request) {

	var expense store.Expense

	id, err := utils.ReadIDParam(r)
	if err != nil {
		eh.logger.Printf("ERROR: ReadIDParam: %v", err)
		utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": "invalid id parameter"})
		return
	}

	err = utils.ReadRequestBody(r, &expense)
	if err != nil {
		eh.logger.Panicf("ERROR: decoding update expense request body %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	user := middleware.GetUser(r)
	expense.UserID = user.ID

	updatedExpense, err := eh.expenseStore.UpdateExpense(id, &expense)
	if updatedExpense == nil {
		utils.WriteJSONResponse(w, http.StatusNotFound, utils.Envelope{"error": "expense not found"})
		return
	}
	if err != nil {
		eh.logger.Printf("ERROR: UpdateExpense: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, utils.Envelope{
		"data": updatedExpense,
	})
}

func (eh *ExpenseHandler) HandleGetAllExpenses(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)

	queryParams := store.ExpenseQueryParams{}
	err := utils.QueryParamsDecoder(r, &queryParams)
	if err != nil {
		eh.logger.Printf("ERROR: QueryParamsDecoder: %v", err)
		utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": "invalid query parameters"})
		return
	}

	expenses, paginationData, relatedItems, metaItems, err := eh.expenseStore.ListExpensesByUserID(user.ID, queryParams)
	if err != nil {
		eh.logger.Printf("ERROR: ListExpensesByUserID: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, utils.Envelope{
		"data":          expenses,
		"pagination":    paginationData,
		"related_items": relatedItems,
		"meta":          metaItems,
	})
}

func (eh *ExpenseHandler) HandleGetExpensesTotalPerDay(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)

	queryParams := store.ExpenseTotalPerDayQueryParams{}
	err := utils.QueryParamsDecoder(r, &queryParams)
	if err != nil {
		eh.logger.Printf("ERROR: QueryParamsDecoder: %v", err)
		utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": "invalid query parameters"})
		return
	}

	expenses, metaItems, err := eh.expenseStore.ListExpensesTotalPerDay(user.ID, queryParams)
	if err != nil {
		eh.logger.Printf("ERROR: ListExpensesTotalPerDay: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, utils.Envelope{
		"data": expenses,
		"meta": metaItems,
	})
}
