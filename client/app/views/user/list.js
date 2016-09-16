import React, { Component } from 'react';
import UserListContainer from '../../containers/user/list_container';

class UserList extends Component {
  render() {
    return (
        <div className="card small-12">
          <div className="card-divider grid-block">
            <div className="small-3">Users</div>
          </div>
          <div>
            <UserListContainer />
          </div>
        </div>
    )
  }
}

export default UserList;
