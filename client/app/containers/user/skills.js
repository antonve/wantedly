import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import UserSkillsComponent from '../../components/user/skills'

const mapStateToProps = (state) => {
  return {
    addSkill: state.user.addSkill,
    toggleSkill: state.user.toggleSkill,
    toggleSkillVisibility: state.user.toggleSkillVisibility,
  }
}

export default connect(mapStateToProps)(UserSkillsComponent)
