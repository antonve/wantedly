package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/engine/standard"
	"github.com/labstack/echo/middleware"

	"log"
	"wantedly/api/utils"
)

func main() {
	// Echo instance
	e := echo.New()
	log.Println("Starting Wantedly API")

	// Middleware
	e.Use(middleware.Recover())
	defer utils.SetupErrorLogging(e)()

	// Serve static assets
	utils.SetupStaticAssets(e)

	// Routes
	utils.SetupRouting(e)

	// Start server
	e.Run(standard.New(":1324"))
}
