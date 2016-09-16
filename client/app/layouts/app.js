import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import Header from './header'
import '../styles/app.scss'
import 'font-awesome/scss/font-awesome.scss'

import authActions from '../actions/session'

class AppLayout extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props

    dispatch(authActions.loadSession())
  }

  render() {
    return (
      <div className="vertical grid-block">
        <Header />
        <div className="grid-block content">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default connect()(AppLayout)
