package controllers

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"
	"wantedly/api/models"

	"golang.org/x/crypto/bcrypt"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
)

// APIUserLogin checks if user exists in database and returns jwt token if valid
func APIUserLogin(context echo.Context) error {
	// Attempt to bind request to User struct
	user := &models.User{}
	err := context.Bind(user)
	if err != nil {
		return Return500(context, err.Error())
	}

	// Get authentication data
	userCollection := models.UserCollection{Users: make([]models.User, 0)}
	dbUser, err := userCollection.GetAuthenticationData(user.Email, user.Password)
	if err != nil {
		return echo.ErrUnauthorized
	}

	// Compare passwords
	err = bcrypt.CompareHashAndPassword(dbUser.Password, user.Password)
	if err != nil {
		return echo.ErrUnauthorized
	}

	// Set custom claims
	dbUser.Password = nil
	claims := &models.JwtClaims{
		dbUser,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 72).Unix(),
		},
	}

	// Create token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	encodedToken, err := token.SignedString([]byte(os.Getenv("WANTEDLY_JWT_KEY")))
	if err != nil {
		return Return500(context, err.Error())
	}

	return context.JSON(http.StatusOK, map[string]interface{}{
		"token": encodedToken,
		"user":  dbUser,
	})
}

// APIUserRegister registers new user
func APIUserRegister(context echo.Context) error {
	user := &models.User{}

	// Attempt to bind request to User struct
	err := context.Bind(user)
	if err != nil {
		return Return500(context, err.Error())
	}

	hashedPassword, err := bcrypt.GenerateFromPassword(user.Password, bcrypt.DefaultCost)
	user.Password = hashedPassword

	// Validate request
	err = user.Validate()
	if err != nil {
		return Return400(context, err.Error())
	}

	// Save to database
	userCollection := models.UserCollection{}
	err = userCollection.Add(user)
	if err != nil {
		return Return500(context, err.Error())
	}

	return Return201(context)

	// return context.JSON(http.StatusOK, token)
}

// APIUserGetAll gets all users
func APIUserGetAll(context echo.Context) error {
	userCollection := models.UserCollection{Users: make([]models.User, 0)}
	err := userCollection.GetAll()

	if err != nil {
		return Return500(context, err.Error())
	}

	return context.JSON(http.StatusOK, userCollection)
}

// APIUserGetByID get the profile of a user
func APIUserGetByID(context echo.Context) error {
	userCollection := models.UserCollection{}

	id, err := strconv.ParseUint(context.Param("id"), 10, 64)
	if err != nil {
		return Return500(context, err.Error())
	}

	userProfile, err := userCollection.GetProfile(id)
	if err != nil {
		return Return500(context, err.Error())
	}

	if userProfile.User == nil {
		return Return404(context, fmt.Sprintf("No User found with id %v", id))
	}

	return context.JSON(http.StatusOK, userProfile)
}

// APIUserUpdate updates a user
func APIUserUpdate(context echo.Context) error {
	user := &models.User{}

	// Attempt to bind request to User struct
	err := context.Bind(user)
	if err != nil {
		return Return500(context, err.Error())
	}

	// Parse out id
	id, err := strconv.ParseUint(context.Param("id"), 10, 64)
	if err != nil {
		return Return500(context, err.Error())
	}
	user.ID = id

	// Update
	userCollection := models.UserCollection{}
	err = userCollection.Update(user)
	if err != nil {
		return Return500(context, err.Error())
	}

	return Return201(context)
}
