import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import authActions from '../../actions/session'

class AuthLogin extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props

    this.checkIfLoggedIn()

    this.refs.email.focus();

    dispatch(authActions.reset())
  }

  componentWillReceiveProps(nextprops) {
    this.checkIfLoggedIn()
  }

  checkIfLoggedIn() {
    if (this.props.currentUser) {
      browserHistory.push('/')
    }
  }

  handleAuth(e) {
    e.preventDefault()

    const { email, password } = this.refs
    const { dispatch } = this.props
    const params = {
      email: email.value,
      password: password.value
    }

    dispatch(authActions.login(params))
  }

  errors() {
    const { failed } = this.props

    if (failed) {
      return (
        <div>
          Invalid Credentials
        </div>
      )
    }

    return null
  }

  render() {
    return (
      <form onSubmit={::this.handleAuth}>
        {::this.errors()}
        <label>Email</label>
        <input
          ref="email"
          type="text"
          placeholder="Email"
          required={true}
        />
        <label>Password</label>
        <input
          ref="password"
          type="password"
          placeholder="Password"
          required={true}
        />
        <button type="submit" className="button">Log In</button>
      </form>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.session
  }
}

export default connect(mapStateToProps)(AuthLogin)
