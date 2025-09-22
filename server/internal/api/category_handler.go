package api

import (
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

func (ch *CategoryHandler) HandleGetAllCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := ch.categoryStore.ListCategories()

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
	stats, err := ch.categoryStore.CategoryStats()

	if err != nil {
		ch.logger.Printf("ERROR: CategoryStats: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, utils.Envelope{
		"data": stats,
	})
}
