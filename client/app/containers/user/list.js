import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import UserList from '../../components/user/list'

const mapStateToProps = (state) => {
  return {
    ...state.user
  }
}

export default connect(mapStateToProps)(UserList)
