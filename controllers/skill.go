package controllers

import (
	"wantedly/api/models"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
)

type addSkillContent struct {
	Name   string `json:"name"`
	UserID uint64 `json:"user_id"`
}

// APISkillAdd adds a new skill to the database
func APISkillAdd(context echo.Context) error {
	// Attempt to bind request to addSkillContent struct
	content := &addSkillContent{}
	err := context.Bind(&content)
	if err != nil {
		return Return500(context, err.Error())
	}

	// Create skill struct
	skill := &models.Skill{Name: content.Name}

	// Grab the user who added the skill
	addedUser := getUser(context)

	// Query which user we should add the skill to
	userCollection := models.UserCollection{}
	ownerUser, err := userCollection.Get(content.UserID)

	// Validate request
	err = skill.Validate()
	if err != nil {
		return Return400(context, err.Error())
	}

	// Save to database
	err = ownerUser.Add(skill, addedUser.ID)
	if err != nil {
		return Return500(context, err.Error())
	}

	return Return201(context)
}

// Helpers
func getUser(context echo.Context) *models.User {
	return (context.Get("user").(*jwt.Token).Claims).(*models.JwtClaims).User
}