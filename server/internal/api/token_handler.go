package api

import (
	"cha-ching-server/internal/store"
	"cha-ching-server/internal/utils"
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type TokenHandler struct {
	tokenStore store.TokenStore
	userStore  store.UserStore
	logger     *log.Logger
}

type createTokenRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func NewTokenHandler(logger *log.Logger, tokenStore store.TokenStore, userStore store.UserStore) *TokenHandler {
	return &TokenHandler{
		tokenStore: tokenStore,
		userStore:  userStore,
		logger:     logger,
	}
}

func (h *TokenHandler) HandleCreateToken(w http.ResponseWriter, r *http.Request) {
	var req createTokenRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		h.logger.Printf("ERROR: createTokenRequest: %v", err)
		utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": "invalid request payload"})
		return
	}

	user, err := h.userStore.GetUserByEmail(req.Email)
	if err != nil || user == nil {
		h.logger.Printf("ERROR: GetUserByEmail: %v", err)
		utils.WriteJSONResponse(w, http.StatusUnauthorized, utils.Envelope{"error": "invalid email or password"})
		return
	}

	passwordsDoMatch, err := user.PasswordHash.Matches(req.Password)
	if err != nil {
		h.logger.Printf("ERROR: PasswordHash.Matches: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	if !passwordsDoMatch {
		utils.WriteJSONResponse(w, http.StatusUnauthorized, utils.Envelope{"error": "invalid email or password"})
		return
	}

	token, err := h.tokenStore.CreateNewToken(user.ID, 24*time.Hour)
	if err != nil {
		h.logger.Printf("ERROR: CreateNewToken: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, utils.Envelope{"data": map[string]interface{}{"auth_token": token.TokenString}})
}
