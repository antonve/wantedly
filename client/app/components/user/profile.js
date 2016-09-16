import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'

import userActions from '../../actions/user'

class UserProfile extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentDidMount() {
    const { dispatch } = this.props

    dispatch(userActions.fetchUserProfile(this.props.userId))
  }

  renderProfile(user, skills) {
    return (<div></div>)
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
      data = this.renderProfile(user, skills)
    }

    return (
      <div className="card small-12">
        <div className="card-divider grid-block">
          <div className="small-3">{user.name}</div>
        </div>
        <div>
          {data}
        </div>
      </div>
    )
  }
}

export default UserProfile
