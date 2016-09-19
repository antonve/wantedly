import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'

import userActions from '../../actions/user'
import UserSkillsComponent from './skills'

class UserProfile extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props

    // Fetch the profile data from the API
    dispatch(userActions.fetchUserProfile(this.props.userId))
  }

  render() {
    const { loading, user, skills, error } = this.props.userProfile

    if (loading || !user) {
      return null
    }

    var data;
    if (error) {
      data = (
        <div className="error-block">
          <span className="alert label">Error: We couldnt connect to server.</span>
        </div>
      )
    } else {
      data = <UserSkillsContainer user={user} skills={skills} />
    }

    return (
      <div className="card small-12">
        <div className="card-divider">
          {user.name}
        </div>
        <div className="card-section">
          {data}
        </div>
      </div>
    )
  }
}

export default UserProfile
