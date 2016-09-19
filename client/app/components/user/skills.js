import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import Gravatar from 'react-circle-gravatar'
import Modal, { SHOW_MODAL } from '../common/modal'

import userActions from '../../actions/user'
import '../../styles/components/user/skills.scss'

class UserSkills extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addSkillModalShown: false
    }
  }

  // Modal

  renderAddSkillModal() {
    const { user, skills } = this.props
    const { addSkillModalShown } = this.state

    if (!addSkillModalShown) {
      return null
    }

    return (
      <Modal modalMode={SHOW_MODAL}>
        <div>
          <div>
            <button type="button" className="button alert">Add skill</button>
            <button type="button" className="button">Cancel</button>
          </div>
        </div>
      </Modal>
    )
  }

  onAddSkillClick() {
    this.setState({
      addSkillModalShown: true
    })
  }

  // Rendering

  renderUsers(skill) {
    let rows = skill.users.map((user, idx) => {
      // We want to limit the list to only 10 users
      if (idx >= 10) {
        return null
      }

      // Use Gravatar for the picture because we don't store one ourselves
      return (
        <li key={user.id}>
          <Link to={`/user/${user.id}`}>
            <Gravatar email={user.email} size={35} rating="g" default="identicon" />
          </Link>
        </li>
      )
    })

    return (
      <ul className="grid-block small-6 skill-user-list align-right">
        {rows}
      </ul>
    )
  }

  renderSkills() {
    const { user, skills, currentUser } = this.props

    // Try to convince the user to add some skills if we don't have any yet
    if (Object.keys(skills).length === 0) {
      // Change message depending on the currentUser
      let message = `${user.name} has no skills added to their profile yet`
      if (user.id === currentUser.id) {
        message = 'You have no skills added to your profile yet';
      }

      return (
        <div>
          {message}, why not <Link onClick={() => this.onAddSkillClick() }>add some</Link>?
        </div>
      )
    }

    return (
      Object.keys(skills).map((key, idx) => {
        let skill = skills[key]
        let isExpanded = (idx < 6)

        return (
          <li key={skill.id} className={`skill-list-item grid-block ` + (isExpanded ? '' : 'shrink')}>
            <a href="" className="skill-count grid-block shrink">
              {skill.count}
            </a>
            <span className={`skill-title ` + (isExpanded ? 'grid-block' : '')}>
              {skill.name}
            </span>
            {isExpanded ? this.renderUsers(skill) : ''}
          </li>
        )
      })
    )
  }

  render() {
    return (
      <div className="skills">
        {this.renderAddSkillModal()}
        <div className="grid-block">
          <h2 className="small-4">
            Skills
          </h2>
          <div className="small-8">
            <Link onClick={() => this.onAddSkillClick()} className="button pull-right">
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
