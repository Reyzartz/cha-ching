package api

import (
	"cha-ching-server/internal/store"
	"cha-ching-server/internal/utils"
	"errors"
	"log"
	"net/http"
	"regexp"
)

type UserHandler struct {
	logger    *log.Logger
	userStore store.UserStore
}

func NewUserHandler(logger *log.Logger, userStore store.UserStore) *UserHandler {
	return &UserHandler{
		logger:    logger,
		userStore: userStore,
	}
}

type registerUserRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (uh *UserHandler) validateUserRegisterRequest(request *registerUserRequest) error {
	if request.Name == "" {
		return errors.New("name is required")
	}

	if request.Email == "" {
		return errors.New("email is required")
	}

	if request.Password == "" {
		return errors.New("password is required")
	}

	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

	if !emailRegex.MatchString(request.Email) {
		return errors.New("invalid email")
	}

	return nil
}

func (uh *UserHandler) HandleCreateUser(w http.ResponseWriter, r *http.Request) {
	var userReq registerUserRequest

	err := utils.ReadRequestBody(r, &userReq)
	if err != nil {
		uh.logger.Printf("ERROR: decoding create user request body: %v", err)
		utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": "invalid request body"})
		return
	}

	err = uh.validateUserRegisterRequest(&userReq)
	if err != nil {
		utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": err.Error()})
		return
	}

	existingUser, err := uh.userStore.GetUserByEmail(userReq.Email)
	if err != nil {
		uh.logger.Printf("ERROR: GetUserByEmail: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	if existingUser != nil {
		utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": "user already exists"})
		return
	}

	user := &store.User{
		Name:  userReq.Name,
		Email: userReq.Email,
	}

	err = user.PasswordHash.Set(userReq.Password)
	if err != nil {
		uh.logger.Printf("ERROR: hashing password: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	createdUser, err := uh.userStore.CreateUser(user)
	if err != nil {
		uh.logger.Printf("ERROR: CreateUser: %v", err)
		utils.WriteJSONResponse(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
		return
	}

	utils.WriteJSONResponse(w, http.StatusCreated, utils.Envelope{
		"data": createdUser,
	})
}
