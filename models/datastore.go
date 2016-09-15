package models

import (
	"log"
	"os"

	// sqlx needs the mysql driver
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

// GetDatabase Return database connection from pool
func GetDatabase() *sqlx.DB {
	// For example:
	// $ WANTEDLY_DATABASE_CONNECTION_STRING="root:@tcp(127.0.0.1:2020)/wantedly"

	db, err := sqlx.Open("mysql", os.Getenv("WANTEDLY_DATABASE_CONNECTION_STRING"))
	if err != nil {
		log.Fatalln("Couldn't connect to database")

		return nil
	}

	return db
}
