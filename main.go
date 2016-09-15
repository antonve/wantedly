package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/engine/standard"
	"github.com/labstack/echo/middleware"

	"fmt"
	"io"
	"log"
	"os"
	"wantedly/api/controllers"
	"wantedly/api/models"
)

func main() {
	// Echo instance
	e := echo.New()
	log.Println("Starting Wantedly API")

	// Middleware
	e.Use(middleware.Recover())
	defer setupErrorLogging(e)()

	// Serve static assets
	setupStaticAssets(e)

	// Routes
	setupRouting(e)

	// Start server
	e.Run(standard.New(":1324"))
}

// Define all routes here
func setupRouting(e *echo.Echo) {
	routesAPI := e.Group("/api")
	// routesAPI.Post("/login", echo.HandlerFunc(controllers.APIUserLogin))
	routesAPI.Post("/register", echo.HandlerFunc(controllers.APIUserRegister))

	routesUser := routesAPI.Group("/user")
	routesUser.Use(middleware.JWTWithConfig(getJWTConfig()))
	routesUser.Get("", echo.HandlerFunc(controllers.APIUserGetAll))
	routesUser.Get("/:id", echo.HandlerFunc(controllers.APIUserGetById))
	routesUser.Put("/:id", echo.HandlerFunc(controllers.APIUserUpdate))
}

func getJWTConfig() middleware.JWTConfig {
	return middleware.JWTConfig{
		Claims:     &models.JwtClaims{},
		SigningKey: []byte(os.Getenv("WANTEDLY_JWT_KEY")),
	}
}

// Serve our static assets, the JS application
func setupStaticAssets(e *echo.Echo) {
	staticPath := "client/web/"
	log.Printf("Serving static files from: %v", staticPath)

	// Any file we can't find we redirect to the index
	e.File("/*", staticPath+"/index.html")

	// This is to serve assets like css and javascript
	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root:   staticPath,
		Browse: true,
	}))
}

// Log to both file and stderr
func setupErrorLogging(e *echo.Echo) func() {
	// Create or open log file
	logFile, err := os.OpenFile("error.log", os.O_CREATE|os.O_APPEND|os.O_RDWR, 0666)
	if err != nil {
		log.Panicln(err)
	}

	// Setup logging to stderr and our log file
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "time=${time_rfc3339}, remote_ip=${remote_ip}, method=${method}, " +
			"path=${path}, status=${status}, took=${response_time}, sent=t=${response_size} bytes\n",
		Output: io.MultiWriter(os.Stderr, logFile),
	}))

	// Return a function that will close the file handle once we exit the application
	return func() {
		e := logFile.Close()
		if e != nil {
			fmt.Fprintf(os.Stderr, "Problem closing the log file: %s\n", e)
		}
	}
}
