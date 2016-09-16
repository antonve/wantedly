import React, { Component } from 'react';
import UserProfileContainer from '../../containers/user/profile';

class UserProfile extends Component {
  render() {
    return <UserProfileContainer userId={this.props.params.id} />
  }
}

export default UserProfile;
