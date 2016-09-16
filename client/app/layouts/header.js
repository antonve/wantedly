import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import authActions from '../actions/session'

class Header extends React.Component {
  nav() {
    return (
      <nav className="small-6 small-offset-4 menu-group-right">
        <ul className="menu-bar condense">
          <li><Link to="/">People</Link></li>
          <li><Link to="/">Profile</Link></li>
          <li><Link onClick={() => this.props.logout()}>Logout</Link></li>
        </ul>
      </nav>
    )
  }

  render() {
    return (
      <header className="grid-block app-header menu-group">
        <div className="small-2 logo">
          <Link to="/">Wantedly</Link>
        </div>
        {::this.nav()}
      </header>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.session
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(authActions.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
