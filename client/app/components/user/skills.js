import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import Gravatar from 'react-circle-gravatar'

import userActions from '../../actions/user'

class UserSkills extends React.Component {
  renderUsers(skill) {
    let rows = skill.users.map((user, idx) => {
      return (
        <li key={user.id}>
          <a href={`/user/${user.id}`}>
            <Gravatar email={user.email} size={30} rating="g" default="identicon" />
          </a>
        </li>
      )
    })

    return (
      <ul>
        {rows}
      </ul>
    )
  }

  renderSkills() {
    const { user, skills } = this.props

    return (
      Object.keys(skills).map((key, idx) => {
        let skill = skills[key]

        return (
          <li key={skill.id} className={idx < 6 ? 'expanded' : ''}>
            <Link>{skill.count}</Link>
            <span>{skill.name}</span>
            {idx < 6 ? this.renderUsers(skill) : ''}
          </li>
        )
      })
    )
  }

  render() {
    return (
      <div className="skills">
        <div className="grid-block">
          <h2 className="small-4">Skills</h2>
          <div className="small-8">
            <Link className="button pull-right">
              <i className="fa fa-plus" aria-hidden="true"></i> Add a skill
            </Link>
          </div>
        </div>

        <ul className="skill-list">
          {this.renderSkills()}
        </ul>
      </div>
    )
  }
}

export default UserSkills
