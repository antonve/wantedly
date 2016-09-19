import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import authActions from '../../actions/session'

class AuthRegister extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props

    this.checkIfLoggedIn()

    this.refs.name.focus();

    dispatch(authActions.reset())
  }

  componentWillReceiveProps(nextProps) {
    this.checkIfLoggedIn()

    // Auto login user after registering
    if (nextProps.registered === true) {
      const { dispatch } = this.props
      dispatch(authActions.login(nextProps.registerData))
    }
  }

  checkIfLoggedIn() {
    if (this.props.currentUser) {
      browserHistory.push('/')
    }
  }

  handleAuth(e) {
    e.preventDefault()

    const { email, password, name } = this.refs
    const { dispatch } = this.props
    const params = {
      name: name.value,
      email: email.value,
      password: password.value
    }

    dispatch(authActions.register(params))
  }

  errors() {
    const { failed, error } = this.props

    if (failed) {
      return (
        <div>
          {error}
        </div>
      )
    }

    return null
  }

  render() {
    return (
      <form onSubmit={::this.handleAuth}>
        {::this.errors()}
        <label>Name</label>
        <input
          ref="name"
          type="text"
          placeholder="Name"
          required={true}
        />
        <label>Email</label>
        <input
          ref="email"
          type="email"
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
        <button type="submit" className="button">Register</button>
      </form>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.session
  }
}

export default connect(mapStateToProps)(AuthRegister)
