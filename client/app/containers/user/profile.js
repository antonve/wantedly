import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import UserProfile from '../../components/user/profile'

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    session: state.session
  }
}

export default connect(mapStateToProps)(UserProfile)
