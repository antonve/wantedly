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
      suggestions: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, user } = this.props

    // Fetch profile with updated data after adding a skill
    if (nextProps.addSkill.success === true) {
      dispatch(userActions.fetchUserProfile(user.id))
      dispatch(userActions.resetAddUserSkill())
    }

    // Fetch profile with updated data after skill toggling
    if (nextProps.toggleSkill.success === true) {
      dispatch(userActions.fetchUserProfile(user.id))
      dispatch(userActions.resetToggleUserSkill())
    }

    // Fetch profile with updated data after skill visibility toggling
    if (nextProps.toggleSkillVisibility.success === true) {
      this.props.skills[nextProps.toggleSkillVisibility.skillId].hidden = !nextProps.toggleSkillVisibility.status
      dispatch(userActions.resetToggleUserSkillVisibility())
    }
  }

  // Modal

  renderAddSkillModal() {
    const { user, skills } = this.props
    const { addSkillModalShown } = this.state

    if (!addSkillModalShown) {
      return null
    }

    let suggestions;

    console.log(this.state.suggestions)
    if (this.state.suggestions.length > 0) {
      const suggestionItems = (
        this.state.suggestions.map((skill, idx) => {
          return (
            <li key={skill.id}>
              <Link className="button" onClick={() => this.onSuggestionClicked(skill.name)}>
                {skill.name}
              </Link>
            </li>
          )
        })
      )

      suggestions = (
        <div>
          <h3>Suggestions: </h3>
          <ul className="suggestion-list grid-block">
            {suggestionItems}
          </ul>
        </div>
      )
    }

    const addSkill = this.addSkill

    return (
      <Modal modalMode={SHOW_MODAL} closeOnBackgroundMode={CLOSE_ON_BACKGROUND}>
        <div>
          <form onSubmit={() => {this.addSkill()}} className="skill-add-form">
            <input ref="modalSkillName" type="text" placeholder="Type skill here..." autoFocus={true} onChange={::this.onSuggest} />
            {suggestions}
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
      addSkillModalShown: true,
      suggestions: [],
    })
  }

  hideAddSkillModal() {
    this.setState({
      ...this.state,
      addSkillModalShown: false,
      suggestions: [],
    })
  }

  onSuggest() {
    const { modalSkillName } = this.refs

    if (modalSkillName.value === '') {
      this.setState({
        ...this.state,
        suggestions: []
      })
      return null
    }

    userActions.fetchSkillSuggestions(modalSkillName.value).then((response) => {
      this.setState({
        ...this.state,
        suggestions: response.data.skills
      })
    })
  }

  onSuggestionClicked(suggestion) {
    const { modalSkillName } = this.refs

    modalSkillName.value = suggestion
    this.addSkill()
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

  handleSkillClick(skill, user, currentStatus) {
    const { currentUser, dispatch } = this.props

    // Ignore clicks on our own profile
    if (currentUser.id === user.id) {
      return null
    }

    // Handle clicks on other profiles
    dispatch(userActions.toggleUserSkill({
      "user_id": user.id,
      "skill_id": skill.id,
      "status": !currentStatus
    }))
  }

  toggleSkillVisibility(skill, currentStatus) {
    const { currentUser, dispatch } = this.props

    // Handle clicks on other profiles
    dispatch(userActions.toggleUserSkillVisibility({
      "user_id": currentUser.id,
      "skill_id": skill.id,
      "status": currentStatus
    }))
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
        // Conditions
        const isExpanded = (idx < 6)
        const isActive = skill.users[currentUser.id] !== undefined
        const isOwner = currentUser.id === user.id

        // Buttons
        const minusButton = <i className="fa fa-minus skill-minus" aria-hidden="true"></i>
        const plusButton = <i className="fa fa-plus skill-plus" aria-hidden="true"></i>
        const currentCounterButton = !isOwner ? (isActive ? minusButton : plusButton) : ''

        // Classes
        const hideSkillButtonsClass = 'hide-skill-buttons-' + (this.state.showHideSkillButtons ? 'active' : 'disabled')
        const sizeClass = (isExpanded ? '' : 'shrink ')
        const hiddenSkillClass = skill.hidden ? 'hidden-skill' : ''
        const liClasses = `skill-list-item grid-block ${sizeClass} ${hideSkillButtonsClass} ${hiddenSkillClass}`
        const titleClasses = `skill-title ` + (isExpanded ? 'grid-block' : '')
        const counterClasses = `skill-count grid-block shrink ` + (isActive ? 'active ' : '') + (isOwner ? 'disabled' : '')

        // Rest
        const users = isExpanded ? this.renderUsers(skill) : ''

        return (
          <li key={skill.id} className={liClasses}>
            <Link onClick={() => this.handleSkillClick(skill, user, isActive)} className={counterClasses}>
              {skill.count}
              {currentCounterButton}
            </Link>
            <Link className={`skill-hide-button`} onClick={() => this.toggleSkillVisibility(skill, false) }>
              <i className="fa fa-trash" aria-hidden="true"></i>
            </Link>
            <Link className={`skill-show-button`} onClick={() => this.toggleSkillVisibility(skill, true) }>
              <i className="fa fa-undo" aria-hidden="true"></i>
            </Link>
            <Link className={titleClasses} to={`/skill/${skill.id}`}>
              {skill.name}
            </Link>
            {users}
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
          <i className="fa fa-trash" aria-hidden="true"></i> {this.state.showHideSkillButtons ? 'Finish updating visibility' : 'Update visibility'}
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
