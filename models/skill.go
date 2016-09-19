package models

import "errors"

// SkillCollection array of users
type SkillCollection struct {
	Skills []Skill `json:"skills"`
}

// Skill model
type Skill struct {
	ID     uint64          `json:"id"`
	Name   string          `json:"name"`
	Hidden bool            `json:"hidden"`
	Users  map[uint64]User `json:"users"`
	Count  int             `json:"count"`
}

// Length returns the amount of skills in the collection
func (skillCollection *SkillCollection) Length() int {
	return len(skillCollection.Skills)
}

// Validate the Skill model
func (skill *Skill) Validate() error {
	if len(skill.Name) == 0 {
		return errors.New("Invalid `Name` supplied.")
	}

	return nil
}

// GetAll returns all skills
func (skillCollection *SkillCollection) GetAll() error {
	db := GetDatabase()
	defer db.Close()

	err := db.Select(&skillCollection.Skills, `
        SELECT
            id,
            name
        FROM skill
    `)

	return err
}

// GetByName returns a skill with a given name
func (skillCollection *SkillCollection) GetByName(name string) (*Skill, error) {
	db := GetDatabase()
	defer db.Close()

	skill := Skill{}

	stmt, err := db.Preparex(`
        SELECT
            id,
            name
        FROM skill
        WHERE name = ?
    `)
	if err != nil {
		return nil, err
	}

	stmt.Get(&skill, name)

	return &skill, err
}

// Add a user to the database
func (skillCollection *SkillCollection) Add(skill *Skill) (uint64, error) {
	db := GetDatabase()
	defer db.Close()

	query := `
        INSERT INTO skill
        SET
            name = :name
    `
	result, err := db.NamedExec(query, skill)
	lastInsertedID, _ := result.LastInsertId()

	return uint64(lastInsertedID), err
}
