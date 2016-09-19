import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'

import userActions from '../../actions/user'

class UserList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentDidMount() {
    const { dispatch } = this.props

    dispatch(userActions.fetchUsers())
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
    const { loading, users, error } = this.props.userList

    if (loading || !users) {
      return null
    }

    var data;
    if (!error) {
      data = (
        <section className="block-list">
          <ul>
            {this.renderRows(users)}
          </ul>
        </section>
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

export default UserList
