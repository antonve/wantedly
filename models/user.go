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
	ID       uint64 `json:"id" db:"id"`
	Email    string `json:"email" db:"email"`
	Name     string `json:"name" db:"name"`
	Password []byte `json:"password" db:"password"`
}

// UserProfile model
type UserProfile struct {
	User   *User             `json:"user"`
	Skills map[uint64]*Skill `json:"skills"`
}

// Local struct to scan query
type profileRow struct {
	ID             uint64 `db:"id"`
	Email          string `db:"email"`
	Name           string `db:"name"`
	Hidden         bool   `db:"hidden"`
	SkillID        uint64 `db:"skillId"`
	SkillName      string `db:"skillName"`
	OwnerUserID    uint64 `db:"ownerUserId"`
	AddedUserID    uint64 `db:"addedUserId"`
	AddedUserName  string `db:"addedUserName"`
	AddedUserEmail string `db:"addedUserEmail"`
}

// JwtClaims json web token claim
type JwtClaims struct {
	User *User `json:"user"`
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
	if user.ID == 0 && len(user.Password) == 0 {
		return errors.New("Invalid `Password` supplied.")
	}

	return nil
}

// GetAll returns all users
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

// GetAllWithSkill returns all users with a certain skill
func (userCollection *UserCollection) GetAllWithSkill(skillID uint64) error {
	db := GetDatabase()
	defer db.Close()

	err := db.Select(&userCollection.Users, `
        SELECT
            id,
            name,
            email
        FROM user AS u
				INNER JOIN userSkill AS us
					ON (u.id = us.ownerUserId)
				WHERE
					us.skillId = ?
				GROUP BY us.ownerUserId, us.SkillId
    `, skillID)

	return err
}

// Get a user by id
func (userCollection *UserCollection) Get(id uint64) (*User, error) {
	db := GetDatabase()
	defer db.Close()

	// Init user
	user := User{}

	// Get user
	stmt, err := db.Preparex(`
				SELECT
					id,
					email,
					name
				FROM user
				WHERE
					id = ?
    `)
	if err != nil {
		return nil, err
	}

	stmt.Get(&user, id)
	return &user, nil
}

// GetProfile a user profile by id
func (userCollection *UserCollection) GetProfile(id uint64) (*UserProfile, error) {
	db := GetDatabase()
	defer db.Close()

	// Init profile
	userProfile := UserProfile{}
	userProfile.Skills = make(map[uint64]*Skill)

	// Query all skill entries
	// The COALESCE is needed to avoid nil scan errors,
	// it's cleaner than having to use NullString/NullInt64 all over the place
	// and having to convert them all over the place.
	rows, err := db.Queryx(`
				SELECT
					u.id,
					u.email,
					u.name,
					COALESCE(s.id, 0) AS skillId,
					COALESCE(s.name, '') AS skillName,
					COALESCE(us.addedUserId, 0) AS addedUserId,
					COALESCE(us.ownerUserId, 0) AS ownerUserId,
					COALESCE(hidden, false) AS hidden,
					COALESCE(au.name, '') AS addedUserName,
					COALESCE(au.email, '') AS addedUserEmail
				FROM user AS u
				LEFT JOIN userSkill AS us
					ON (us.ownerUserId = u.id)
				LEFT JOIN skill AS s
					ON (s.id = us.skillId)
				LEFT JOIN user AS au
					ON (au.id = us.addedUserId)
				WHERE
					u.id = ?
    `, id)
	if err != nil {
		return nil, err
	}

	// Iterate over all loops and build user profile
	for rows.Next() {
		var row profileRow
		err = rows.StructScan(&row)

		if err != nil {
			return nil, err
		}

		// Create user if we haven't yet
		if userProfile.User == nil {
			userProfile.User = &User{
				ID:    row.ID,
				Email: row.Email,
				Name:  row.Name,
			}
		}

		// Don't handle skills if we didn't find any
		if row.SkillID == 0 {
			continue
		}

		// Create skill if we haven't yet
		if _, ok := userProfile.Skills[row.SkillID]; !ok {
			userProfile.Skills[row.SkillID] = &Skill{
				ID:     row.SkillID,
				Name:   row.SkillName,
				Hidden: row.Hidden,
				Count:  0,
				Users:  make(map[uint64]User, 0),
			}
		}

		// Add user to the list if it's someone else than the profile owner
		if row.OwnerUserID != row.AddedUserID {
			userProfile.Skills[row.SkillID].Count++

			user := User{
				ID:    row.AddedUserID,
				Name:  row.AddedUserName,
				Email: row.AddedUserEmail,
			}
			userProfile.Skills[row.SkillID].Users[user.ID] = user
		}
	}

	return &userProfile, nil
}

// GetAuthenticationData get data needed to generate jwt token
func (userCollection *UserCollection) GetAuthenticationData(email string, password []byte) (*User, error) {
	db := GetDatabase()
	defer db.Close()

	user := User{}

	stmt, err := db.Preparex(`
        SELECT
            id,
            name,
            email,
            password
        FROM user
        WHERE email = ?
    `)
	if err != nil {
		return nil, err
	}

	stmt.Get(&user, email)

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
		err = fmt.Errorf("No user found with id %v", user.ID)
	}

	return err
}

// AddSkill to a user in the database
func (user *User) AddSkill(skill *Skill, addedUserID uint64) error {
	db := GetDatabase()
	defer db.Close()
	skillCollection := SkillCollection{Skills: make([]Skill, 0)}

	// We only need to handle skills if we don't have an idea
	if skill.ID == 0 {
		// Try to fetch the skill first
		fetchedSkill, err := skillCollection.GetByName(skill.Name)
		if err != nil {
			return err
		}

		// Insert new skill into the database if we couldn't fetch one
		if fetchedSkill.ID == 0 {
			id, err := skillCollection.Add(skill)
			skill.ID = id

			if err != nil {
				return err
			}
		} else {
			skill = fetchedSkill
		}
	}

	// Attach skill to the user
	query := `
        INSERT INTO userSkill
        SET
            ownerUserId = :ownerUserId,
            addedUserId = :addedUserId,
            skillId = :skillId,
            hidden = 0
    `

	data := map[string]interface{}{
		"ownerUserId": user.ID,
		"addedUserId": addedUserID,
		"skillId":     skill.ID,
	}

	_, err := db.NamedExec(query, data)

	return err
}

// DeleteSkill to a user in the database
func (user *User) DeleteSkill(skill *Skill, addedUserID uint64) error {
	db := GetDatabase()
	defer db.Close()

	// Attach skill to the user
	query := `
        DELETE FROM userSkill
        WHERE
            ownerUserId = :ownerUserId
            AND addedUserId = :addedUserId
            AND skillId = :skillId
    `

	data := map[string]interface{}{
		"ownerUserId": user.ID,
		"addedUserId": addedUserID,
		"skillId":     skill.ID,
	}

	_, err := db.NamedExec(query, data)

	return err
}

// ToggleSkill of a user in the database
func (user *User) ToggleSkill(skill *Skill, status bool) error {
	db := GetDatabase()
	defer db.Close()

	// Toggle skill
	query := `
        UPDATE userSkill
				SET hidden = :status
        WHERE
            ownerUserId = :ownerUserId
            AND skillId = :skillId
    `

	data := map[string]interface{}{
		"ownerUserId": user.ID,
		"skillId":     skill.ID,
		"status":      !status,
	}

	_, err := db.NamedExec(query, data)

	return err
}
