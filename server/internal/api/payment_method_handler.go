package api

import (
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
	paymentMethods, err := ph.paymentMethodStore.ListPaymentMethods()
	if err != nil {
		ph.logger.Printf("ERROR: ListPaymentMethods: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, utils.Envelope{
		"data": paymentMethods,
	})
}
