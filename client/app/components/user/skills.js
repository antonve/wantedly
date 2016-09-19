import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import Gravatar from 'react-circle-gravatar'

import userActions from '../../actions/user'
import '../../styles/components/user/skills.scss'

class UserSkills extends React.Component {
  renderUsers(skill) {
    let rows = skill.users.map((user, idx) => {
      return (
        <li key={user.id}>
          <a href={`/user/${user.id}`}>
            <Gravatar email={user.email} size={35} rating="g" default="identicon" />
          </a>
        </li>
      )
    })

    return (
      <ul className="grid-block small-6 skill-user-list">
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
          <li key={skill.id} className={`skill-list-item grid-block ` + (idx < 6 ? '' : 'shrink')}>
            <a href="" className="skill-count grid-block shrink">{skill.count}</a>
            <span className={`skill-title ` + (idx < 6 ? 'grid-block small-5' : '')}>{skill.name}</span>
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
