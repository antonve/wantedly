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

    if (loading) {
      return null
    }

    var data;
    if (!error && user !== null) {
      data = (
        <div className="card small-12">
          <div className="card-divider">
            {user.name}
          </div>
          <div className="card-section">
            <UserSkillsComponent user={user} skills={skills} />
          </div>
        </div>
      )
    }

    return (
      <div>
        <div className={`notification error ${error ? '' : 'hidden'}`}>
          Error: We couldnt connect to server.
        </div>
        {data}
      </div>
    )
  }
}

export default UserProfile
