import React, { Component } from 'react'
import { Link } from 'react-router'
import UserRegisterFormContainer from '../../components/auth/register'

class UserRegister extends Component {
  render() {
    return (
      <div className="card small-12">
        <div className="card-divider grid-block">
          <div className="small-3">Register</div>
        </div>
        <div className="card-section">
          <UserRegisterFormContainer />
        </div>
      </div>
    );
  }
}


export default UserRegister;
