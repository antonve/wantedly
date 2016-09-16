import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'

import userActions from '../../actions/user'

class UserSkills extends React.Component {
  render() {
    const { user, skills } = this.props

    return (
      <div className="skills grid-block">
        <h2 className="small-4">Skills</h2>
        <div className="small-8">
          <Link className="button pull-right">
            <i className="fa fa-plus" aria-hidden="true"></i> Add a skill
          </Link>
        </div>
      </div>
    )
  }
}

export default UserSkills
