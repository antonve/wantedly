import React, { Component } from 'react'
import { Link } from 'react-router'
import UserLoginFormContainer from '../../components/auth/login'

class UserLogin extends Component {
  render() {
    return (
      <div className="card small-12">
        <div className="card-divider grid-block">
          <div className="small-3">Log in</div>
          <Link to={`/register`} className="small-3 small-offset-6 text-right">
            <i className="fa fa-th-list" aria-hidden="true"></i> Register
          </Link>
        </div>
        <div className="card-section">
          <UserLoginFormContainer />
        </div>
      </div>
    );
  }
}


export default UserLogin;
