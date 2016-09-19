import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'

import userActions from '../../actions/user'

class SkillList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentDidMount() {
    this.fetchUsers()
  }

  componentDidUpdate() {
    // Fetch new data if we received a new skill id
    if (this.props.userWithSkillList.skill !== null
        && this.props.skillId != this.props.userWithSkillList.skill.id) {
      this.fetchUsers()
    }
  }

  fetchUsers() {
    const { dispatch } = this.props

    dispatch(userActions.fetchUsersWithSkill(this.props.skillId))
  }

  renderRows(users) {
    return (
      users.map((user, idx) => {
        return (
          <li key={user.id}>
            <Link to={`/user/${user.id}`}>
              {user.name}
            </Link>
          </li>
        )
      })
    )
  }

  render() {
    const { loading, users, error, skill } = this.props.userWithSkillList

    if (loading || !users || !skill) {
      return null
    }

    var data;
    if (!error) {
      data = (
        <div className="card small-12">
          <div className="card-divider grid-block">
            <div className="small-12">Users with skill <span className="label-heading">{skill.name}</span></div>
          </div>
          <div>
          <section className="block-list">
            <ul>
              {this.renderRows(users)}
            </ul>
          </section>
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

export default SkillList
