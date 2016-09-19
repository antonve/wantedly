package controllers

import (
	"log"
	"net/http"
	"wantedly/api/models"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
)

func Return201(context echo.Context) error {
	return context.JSONBlob(http.StatusCreated, []byte(`{"success": true}`))
}

func Return200(context echo.Context) error {
	return context.JSONBlob(http.StatusOK, []byte(`{"success": true}`))
}

func Return400(context echo.Context, err string) error {
	log.Println(err)
	return Serve400(context)
}

func Serve400(context echo.Context) error {
	return context.JSONBlob(http.StatusBadRequest, []byte(`{"success": false, "errorCode": 400, "errorMessage": "400 bad request"}`))
}

func Return404(context echo.Context, err string) error {
	log.Println(err)
	return Serve404(context)
}

func Serve404(context echo.Context) error {
	return context.JSONBlob(http.StatusNotFound, []byte(`{"success": false, "errorCode": 404, "errorMessage": "404 page not found"}`))
}

func Serve405(context echo.Context) error {
	return context.JSONBlob(http.StatusMethodNotAllowed, []byte(`{"success": false, "errorCode": 405, "errorMessage": "405 method not allowed"}`))
}

func Return500(context echo.Context, err string) error {
	log.Println(err)
	return Serve500(context)
}

func Serve500(context echo.Context) error {
	return context.JSONBlob(http.StatusInternalServerError, []byte(`{"success": false, "errorCode": 500, "errorMessage": "500 internal server error"}`))
}

func getUser(context echo.Context) *models.User {
	return (context.Get("user").(*jwt.Token).Claims).(*models.JwtClaims).User
}
