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

type toggleSkillContent struct {
	SkillID uint64 `json:"skill_id"`
	UserID  uint64 `json:"user_id"`
	Status  bool   `json:"status"`
}

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

// APIUserGetAllWithSkill gets all users with a certain skill
func APIUserGetAllWithSkill(context echo.Context) error {
	userCollection := models.UserCollection{Users: make([]models.User, 0)}

	// Get skill id
	id, err := strconv.ParseUint(context.Param("id"), 10, 64)
	if err != nil {
		return Return500(context, err.Error())
	}

	// Get skill data
	skillCollection := models.SkillCollection{}
	skill, err := skillCollection.Get(id)
	if err != nil {
		return Return500(context, err.Error())
	}

	// Get all users
	err = userCollection.GetAllWithSkill(skill.ID)
	if err != nil {
		return Return500(context, err.Error())
	}

	// Prepare JSON data
	data := map[string]interface{}{
		"users": userCollection.Users,
		"skill": skill,
	}

	return context.JSON(http.StatusOK, data)
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

// APIUserToggleSkill toggles a skill on a user
func APIUserToggleSkill(context echo.Context) error {
	// Attempt to bind request to addSkillContent struct
	content := &toggleSkillContent{}
	err := context.Bind(&content)
	if err != nil {
		return Return500(context, err.Error())
	}

	// Create skill struct
	skill := &models.Skill{ID: content.SkillID}

	// Grab the user who added the skill
	addedUser := getUser(context)

	// Query which user we should add the skill to
	ownerUserID, err := strconv.ParseUint(context.Param("id"), 10, 64)
	if err != nil {
		return Return500(context, err.Error())
	}
	userCollection := models.UserCollection{}
	ownerUser, err := userCollection.Get(ownerUserID)

	// Delete or add skill to user
	// Save to database
	if content.Status {
		err = ownerUser.AddSkill(skill, addedUser.ID)
	} else {
		err = ownerUser.DeleteSkill(skill, addedUser.ID)
	}

	if err != nil {
		return Return500(context, err.Error())
	}

	return Return201(context)
}

// APIUserToggleSkillVisibility toggles the visibility of a skill on a user
func APIUserToggleSkillVisibility(context echo.Context) error {
	// Attempt to bind request to addSkillContent struct
	content := &toggleSkillContent{}
	err := context.Bind(&content)
	if err != nil {
		return Return500(context, err.Error())
	}

	// Create skill struct
	skill := &models.Skill{ID: content.SkillID}

	// Grab the user whose skills we want to toggle the visibility of
	currentUser := getUser(context)

	// Save to database
	err = currentUser.ToggleSkill(skill, content.Status)

	if err != nil {
		return Return500(context, err.Error())
	}

	return Return201(context)
}
