import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import UserProfile from '../../components/user/profile'

const mapStateToProps = (state) => {
  return {
    ...state.user
  }
}

export default connect(mapStateToProps)(UserProfile)
