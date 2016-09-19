import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import Gravatar from 'react-circle-gravatar'
import Modal, { SHOW_MODAL, CLOSE_ON_BACKGROUND } from '../common/modal'

import userActions from '../../actions/user'
import '../../styles/components/user/skills.scss'

class UserSkills extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addSkillModalShown: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, user } = this.props

    // Fetch profile with updated data
    if (nextProps.addSkill.success === true) {
      dispatch(userActions.fetchUserProfile(user.id))
      dispatch(userActions.resetAddUserSkill())
    }
  }

  // Modal

  renderAddSkillModal() {
    const { user, skills } = this.props
    const { addSkillModalShown } = this.state

    if (!addSkillModalShown) {
      return null
    }

    let addSkill = this.addSkill

    return (
      <Modal modalMode={SHOW_MODAL} closeOnBackgroundMode={CLOSE_ON_BACKGROUND}>
        <div>
          <form className="skill-add-form">
            <input ref="modalSkillName" type="text" placeholder="Type skill here..." />
            <button type="button" onClick={() => this.addSkill()} className="button alert">Add skill</button>
            <button type="button" onClick={() => this.hideAddSkillModal()} className="button">Cancel</button>
          </form>
        </div>
      </Modal>
    )
  }

  addSkill() {
    const { user, dispatch } = this.props
    const { modalSkillName } = this.refs

    console.log('gegerq', {
      "user_id": user.id,
      "name": modalSkillName.value
    })

    dispatch(userActions.addUserSkill({
      "user_id": user.id,
      "name": modalSkillName.value
    }))
  }

  showAddSkillModal() {
    this.setState({
      addSkillModalShown: true
    })
  }

  hideAddSkillModal() {
    this.setState({
      addSkillModalShown: false
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
      <ul className="grid-block skill-user-list align-right">
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
            <Link onClick={() => this.showAddSkillModal()} className="button pull-right">
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
