import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as talentActions from '../../modules/talents';
import { map } from 'lodash';
import CSSModules from 'react-css-modules';

import TalentNode from './TalentNode';
import styles from './Talents.scss';

@connect(({talents}) => ({ ...talents}), { ...talentActions })
@CSSModules(styles)
export default class TalentPanel extends Component {
  state = {}
  static propTypes = {}
  static defaultProps = {
    masteries: {}
  }

  componentDidMount() {
    this.props.loadMasteries()
  }

  renderBranches(){
    return map(this.props.masteries, (branch, branchName) => {
      const tiers = map(branch, (tierMasteries, key) => {
        const masteries = map(tierMasteries, mastery => {
          return (<TalentNode {...mastery} key={mastery.name}/>);
        })

        return (<div styleName="mastery_layer">{masteries}</div>)
      });

      return (
        <div key={branchName} styleName="mastery_branch">
          {tiers}
          <div styleName="mastery_branch_name">
            {branchName.replace(branchName.charAt(0), branchName.charAt(0).toUpperCase())}
          </div>
        </div>
      )
    })
  }

  render() {

    return (
      <div styleName="mastery_wrapper">
        <div>
          <button styleName="mastery_return_button">Return points</button>
        </div>
        <div>
          {this.renderBranches()}
        </div>
      </div>
    );
  }
}