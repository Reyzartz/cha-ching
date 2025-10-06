package api

import (
	"cha-ching-server/internal/middleware"
	"cha-ching-server/internal/store"
	"cha-ching-server/internal/utils"
	"log"
	"net/http"
)

type CategoryHandler struct {
	logger        *log.Logger
	categoryStore store.CategoryStore
}

func NewCategoryHandler(logger *log.Logger, categoryStore store.CategoryStore) *CategoryHandler {
	return &CategoryHandler{
		logger,
		categoryStore,
	}
}

func (ch *CategoryHandler) HandleCreateCategory(w http.ResponseWriter, r *http.Request) {
	var category store.Category

	err := utils.ReadRequestBody(r, &category)
	if err != nil {
		ch.logger.Printf("ERROR: decoding create category request body: %v", err)
		utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": "invalid request body"})
		return
	}

	user := middleware.GetUser(r)
	category.UserID = user.ID

	createdCategory, err := ch.categoryStore.CreateCategory(&category)
	if err != nil {
		ch.logger.Printf("ERROR: CreateCategory: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusCreated, utils.Envelope{
		"data": createdCategory,
	})
}

func (ch *CategoryHandler) HandleUpdateCategory(w http.ResponseWriter, r *http.Request) {
	var category store.Category

	err := utils.ReadRequestBody(r, &category)
	if err != nil {
		ch.logger.Printf("ERROR: decoding update category request body: %v", err)
		utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": "invalid request body"})
		return
	}

	user := middleware.GetUser(r)
	category.UserID = user.ID

	updatedCategory, err := ch.categoryStore.UpdateCategory(&category)
	if err != nil {
		ch.logger.Printf("ERROR: UpdateCategory: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	if updatedCategory == nil {
		utils.WriteJSONResponse(w, http.StatusNotFound, utils.Envelope{"error": "category not found"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, utils.Envelope{
		"data": updatedCategory,
	})
}

func (ch *CategoryHandler) HandleGetAllCategories(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)

	categories, err := ch.categoryStore.ListCategories(user.ID)

	if err != nil {
		ch.logger.Printf("ERROR: ListCategories: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, utils.Envelope{
		"data": categories,
	})
}

func (ch *CategoryHandler) HandleGetCategoryStats(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)

	var queryParams store.CategoryStatQueryParams
	err := utils.QueryParamsDecoder(r, &queryParams)
	if err != nil {
		ch.logger.Printf("ERROR: QueryParamsDecoder: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	stats, err := ch.categoryStore.CategoryStats(user.ID, queryParams)
	if err != nil {
		ch.logger.Printf("ERROR: CategoryStats: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, utils.Envelope{
		"data": stats,
	})
}
