package utils

import (
	"wantedly/api/controllers"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

// SetupRouting Define all routes here
func SetupRouting(e *echo.Echo) {
	routesAPI := e.Group("/api")
	routesAPI.Post("/login", echo.HandlerFunc(controllers.APIUserLogin))
	routesAPI.Post("/register", echo.HandlerFunc(controllers.APIUserRegister))

	routesUser := routesAPI.Group("/user")
	routesUser.Use(middleware.JWTWithConfig(GetJWTConfig()))
	routesUser.Get("", echo.HandlerFunc(controllers.APIUserGetAll))
	routesUser.Get("/:id", echo.HandlerFunc(controllers.APIUserGetByID))
	routesUser.Put("/:id", echo.HandlerFunc(controllers.APIUserUpdate))

	routesSkill := routesAPI.Group("/skill")
	routesSkill.Use(middleware.JWTWithConfig(GetJWTConfig()))
	routesSkill.Post("", echo.HandlerFunc(controllers.APISkillAdd))
}
