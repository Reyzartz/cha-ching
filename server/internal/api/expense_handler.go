package api

import (
	"cha-ching-server/internal/store"
	"cha-ching-server/internal/utils"
	"fmt"
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

func (eh *ExpenseHandler) HandleCreateUser(w http.ResponseWriter, r *http.Request) {
	var user store.User

	if err := utils.ReadRequestBody(r, &user); err != nil {
		eh.logger.Printf("ERROR: decoding create user request body: %v", err)
		utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": "invalid request body"})
		return
	}

	createdUser, err := eh.expenseStore.CreateUser(&user)
	if err != nil {
		eh.logger.Printf("ERROR: CreateUser: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusCreated, utils.Envelope{
		"data": createdUser,
	})
}

func (eh *ExpenseHandler) HandleGetUser(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ReadIDParam(r)
	if err != nil {
		eh.logger.Printf("ERROR: ReadIDParam: %v", err)
		utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": "invalid id parameter"})
		return
	}

	user, err := eh.expenseStore.GetUserByID(id)
	fmt.Printf("User: %+v, Error: %v\n", user, err)
	if err != nil {
		eh.logger.Printf("ERROR: GetUserByID: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, utils.Envelope{
		"data": user,
	})
}





func (eh *ExpenseHandler) HandleCreateExpense(w http.ResponseWriter, r *http.Request) {
	var expense store.Expense

	err := utils.ReadRequestBody(r, &expense)
	if err != nil {
		eh.logger.Printf("ERROR: decoding create expense request body: %v", err)
		utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": "invalid request body"})
		return
	}

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

func (eh *ExpenseHandler) HandleGetAllExpenses(w http.ResponseWriter, r *http.Request) {
	// For simplicity, we are using a hardcoded user ID.
	// In a real application, you would get this from the authenticated user context.
	userID := int64(1)

	expenses, relatedItems, err := eh.expenseStore.ListExpensesByUserID(userID)
	if err != nil {
		eh.logger.Printf("ERROR: ListExpensesByUserID: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, utils.Envelope{
		"data":          expenses,
		"related_items": relatedItems,
	})
}
