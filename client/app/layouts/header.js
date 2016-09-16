import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class Header extends React.Component {
  nav() {
    return (
      <nav className="small-6 small-offset-4 menu-group-right">
        <ul className="menu-bar condense">
          <li><Link to="/">People</Link></li>
          <li><Link to="/">Profile</Link></li>
          <li><Link to="/">Logout</Link></li>
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

export default connect(mapStateToProps)(Header)
