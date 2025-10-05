package middleware

import (
	"cha-ching-server/internal/store"
	"cha-ching-server/internal/utils"
	"context"
	"net/http"
)

type UserMiddleware struct {
	UserStore store.UserStore
}

func NewUserMiddleware(userStore store.UserStore) *UserMiddleware {
	return &UserMiddleware{
		UserStore: userStore,
	}
}

type contextKey string

const userContextKey = contextKey("user")

func SetUser(r *http.Request, user *store.User) *http.Request {
	ctx := context.WithValue(r.Context(), userContextKey, user)
	r = r.WithContext(ctx)
	return r
}

func GetUser(r *http.Request) *store.User {
	user, ok := r.Context().Value(userContextKey).(*store.User)

	if !ok {
		panic("missing user in request")
	}

	return user
}

func (um *UserMiddleware) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Authorization")
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			r = SetUser(r, store.AnonymousUser)
			next.ServeHTTP(w, r)
			return
		}

		tokenString, err := utils.ExtractTokenFromHeader(authHeader)
		if err != nil {
			utils.WriteJSONResponse(w, http.StatusBadRequest, utils.Envelope{"error": "invalid authorization header"})
			return
		}

		user, err := um.UserStore.GetUserByToken(tokenString)
		if err != nil || user == nil {
			utils.WriteJSONResponse(w, http.StatusUnauthorized, utils.Envelope{"error": "invalid or expired token"})
			return
		}

		r = SetUser(r, user)
		next.ServeHTTP(w, r)
	})
}

func (um *UserMiddleware) RequireAuthenticatedUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := GetUser(r)
		if user == store.AnonymousUser {
			utils.WriteJSONResponse(w, http.StatusUnauthorized, utils.Envelope{"error": "you must be authenticated to access this resource"})
			return
		}

		next.ServeHTTP(w, r)
	})
}
