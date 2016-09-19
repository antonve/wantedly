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
      addSkillModalShown: false,
      showHideSkillButtons: false,
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

    dispatch(userActions.addUserSkill({
      "user_id": user.id,
      "name": modalSkillName.value
    }))
  }

  showAddSkillModal() {
    this.setState({
      ...this.state,
      addSkillModalShown: true
    })
  }

  hideAddSkillModal() {
    this.setState({
      ...this.state,
      addSkillModalShown: false
    })
  }

  // Handlers

  showHideSkillButtons() {
    this.setState({
      ...this.state,
      showHideSkillButtons: true
    })
  }

  hideHideSkillButtons() {
    this.setState({
      ...this.state,
      showHideSkillButtons: false
    })
  }

  toggleHideSkillButtons() {
    if (this.state.showHideSkillButtons) {
      this.hideHideSkillButtons()
    } else {
      this.showHideSkillButtons()
    }
  }

  handleSkillClick(skill, currentUser, user) {
    if (currentUser.id === user.id) {
      return null
    }
  }

  // Rendering

  renderUsers(skill) {
    let rows = Object.keys(skill.users).map((key, idx) => {
      let user = skill.users[key]

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

    // We're creating an array of the skills for easy sorting
    const skillsArray = Object.keys(skills).map((key) => skills[key])

    return (
      skillsArray.sort((a, b) => {
        return b.count - a.count
      }).map((skill, idx) => {
        const isExpanded = (idx < 6)
        const isActive = skill.users[currentUser.id] !== undefined
        const isOwner = currentUser.id === user.id
        const minusButton = <i className="fa fa-minus skill-minus" aria-hidden="true"></i>
        const plusButton = <i className="fa fa-plus skill-plus" aria-hidden="true"></i>

        return (
          <li key={skill.id} className={`skill-list-item grid-block ` + (isExpanded ? '' : 'shrink ') + 'hide-skill-buttons-' + (this.state.showHideSkillButtons ? 'active' : 'disabled')}>
            <Link onClick={() => this.handleSkillClick(skill, currentUser, user)} className={`skill-count grid-block shrink ` + (isActive ? 'active ' : '') + (isOwner ? 'disabled' : '')}>
              {skill.count}
              {!isOwner ? (isActive ? minusButton : plusButton) : ''}
            </Link>
            <Link className={`skill-hide-button`} onClick={() => this.showHideSkillButtons() }><i className="fa fa-trash" aria-hidden="true"></i></Link>
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
    const { user, currentUser } = this.props
    let hideButton

    if (currentUser.id === user.id) {
      hideButton = (
        <Link onClick={() => this.toggleHideSkillButtons()} className="button warning">
          <i className="fa fa-trash" aria-hidden="true"></i> {this.state.showHideSkillButtons ? 'Done hiding skills' : 'Hide skills'}
        </Link>
      )
    }

    return (
      <div className="skills">
        {this.renderAddSkillModal()}
        <div className="grid-block">
          <h2 className="small-4">
            Skills
          </h2>
          <div className="small-8 text-right">
            <Link onClick={() => this.showAddSkillModal()} className="button">
              <i className="fa fa-plus" aria-hidden="true"></i> Add a skill
            </Link>
            {hideButton}
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
