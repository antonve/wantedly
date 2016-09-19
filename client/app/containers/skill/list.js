import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import SkillList from '../../components/skill/list'

const mapStateToProps = (state) => {
  return {
      userWithSkillList: state.user.userWithSkillList,
  }
}

export default connect(mapStateToProps)(SkillList)
