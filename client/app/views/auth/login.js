import React, { Component } from 'react'
import { Link } from 'react-router'
import UserLoginFormContainer from '../../components/auth/login'

class UserLogin extends Component {
  render() {
    return (
      <div className="card small-12">
        <div className="card-divider grid-block">
          <div className="small-12">Log in</div>
        </div>
        <div className="card-section">
          <UserLoginFormContainer />
        </div>
      </div>
    );
  }
}


export default UserLogin;
