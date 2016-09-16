// From https://github.com/joshgeller/react-redux-jwt-auth-example

import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router'

export default function requireAuthentication(Component) {
  class AuthenticatedComponent extends React.Component {
    componentWillMount() {
      this.checkAuth();
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth();
    }

    checkAuth() {
      if (this.props.currentUser === null) {
        browserHistory.push('/login');
      }
    }

    render() {
      return (
        <div>
          { this.props.currentUser !== null ? <Component {...this.props}/> : null }
        </div>
      )
    }
  }

  const mapStateToProps = (state) => ({
    ...state.session
  });

  return connect(mapStateToProps)(AuthenticatedComponent);
}
