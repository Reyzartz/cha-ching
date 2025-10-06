package api

import (
	"cha-ching-server/internal/middleware"
	"cha-ching-server/internal/store"
	"cha-ching-server/internal/utils"
	"log"
	"net/http"
)

type PaymentMethodHandler struct {
	logger             *log.Logger
	paymentMethodStore store.PaymentMethodStore
}

func NewPaymentMethodHandler(logger *log.Logger, paymentMethodStore store.PaymentMethodStore) *PaymentMethodHandler {
	return &PaymentMethodHandler{
		logger,
		paymentMethodStore,
	}
}

func (ph *PaymentMethodHandler) HandleCreatePaymentMethod(w http.ResponseWriter, r *http.Request) {
	var paymentMethod store.PaymentMethod

	err := utils.ReadRequestBody(r, &paymentMethod)
	if err != nil {
		ph.logger.Printf("ERROR: decoding create payment method request body: %v", err)
		utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": "invalid request body"})
		return
	}

	user := middleware.GetUser(r)
	paymentMethod.UserID = user.ID

	createdPaymentMethod, err := ph.paymentMethodStore.CreatePaymentMethod(&paymentMethod)
	if err != nil {
		ph.logger.Printf("ERROR: CreatePaymentMethod: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusCreated, utils.Envelope{
		"data": createdPaymentMethod,
	})
}

func (ph *PaymentMethodHandler) HandleGetAllPaymentMethods(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)

	paymentMethods, err := ph.paymentMethodStore.ListPaymentMethods(user.ID)
	if err != nil {
		ph.logger.Printf("ERROR: ListPaymentMethods: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, utils.Envelope{
		"data": paymentMethods,
	})
}

func (ph *PaymentMethodHandler) HandleGetPaymentMethodStats(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)

	var queryParams store.PaymentMethodStatsQueryParams

	err := utils.QueryParamsDecoder(r, &queryParams)
	if err != nil {
		ph.logger.Printf("ERROR: decoding payment method stats query params: %v", err)
		utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": "invalid query params"})
		return
	}

	stats, err := ph.paymentMethodStore.PaymentMethodStats(user.ID, queryParams)
	if err != nil {
		ph.logger.Printf("ERROR: PaymentMethodStats: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, utils.Envelope{
		"data": stats,
	})
}
