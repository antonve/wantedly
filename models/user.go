package models

import (
	"errors"
	"fmt"

	jwt "github.com/dgrijalva/jwt-go"
)

// UserCollection array of users
type UserCollection struct {
	Users []User `json:"users"`
}

// User model
type User struct {
	Id       uint64 `json:"id" db:"id"`
	Email    string `json:"email" db:"email"`
	Name     string `json:"name" db:"name"`
	Password []byte `json:"password" db:"password"`
}

// JwtClaims json web token claim
type JwtClaims struct {
	Id    uint64 `json:"id" db:"id"`
	Email string `json:"email" db:"email"`
	Name  string `json:"name" db:"name"`
	jwt.StandardClaims
}

// Length returns the amount of users in the collection
func (userCollection *UserCollection) Length() int {
	return len(userCollection.Users)
}

// Validate the User model
func (user *User) Validate() error {
	if len(user.Email) == 0 {
		return errors.New("Invalid `Email` supplied.")
	}
	if len(user.Name) == 0 {
		return errors.New("Invalid `Name` supplied.")
	}
	if user.Id == 0 && len(user.Password) == 0 {
		return errors.New("Invalid `Password` supplied.")
	}

	return nil
}

// GetAll returns all user
func (userCollection *UserCollection) GetAll() error {
	db := GetDatabase()
	defer db.Close()

	err := db.Select(&userCollection.Users, `
        SELECT
            id,
            name,
            email
        FROM user
    `)

	return err
}

// Get a user by id
func (userCollection *UserCollection) Get(id uint64) (*User, error) {
	db := GetDatabase()
	defer db.Close()

	user := User{}

	stmt, err := db.Preparex(`
        SELECT
            id,
            name,
            email
        FROM user
        WHERE id = ?
    `)
	if err != nil {
		return nil, err
	}

	stmt.Get(&user, id)

	return &user, err
}

// Add a user to the database
func (userCollection *UserCollection) Add(user *User) error {
	db := GetDatabase()
	defer db.Close()

	query := `
        INSERT INTO user
        SET
            name = :name,
            email = :email,
            password = :password
    `
	_, err := db.NamedExec(query, user)

	return err
}

// Update a user
func (userCollection *UserCollection) Update(user *User) error {
	db := GetDatabase()
	defer db.Close()

	query := `
        UPDATE user
        SET
            name = :name,
            email = :email
        WHERE id = :id
    `
	result, err := db.NamedExec(query, user)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if rows == 0 {
		err = fmt.Errorf("No user found with id %v", user.Id)
	}

	return err
}
