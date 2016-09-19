import React, { Component } from 'react';
import SkillListContainer from '../../containers/skill/list';

class SkillList extends Component {
  render() {
    return <SkillListContainer skillId={this.props.params.id} />
  }
}

export default SkillList;
