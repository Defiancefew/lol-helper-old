import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as talentActions from '../../modules/talents';
import { map } from 'lodash';
import CSSModules from 'react-css-modules';

import TalentNode from './TalentNode';
import styles from './Talents.scss';

const { func, string, number } = PropTypes;

@connect(({ talents }) => ({ ...talents.toJS() }), { ...talentActions })
@CSSModules(styles)
export default class TalentPanel extends Component {

  static propTypes = {
    masteries: PropTypes.object,
    pointsLeft: PropTypes.number,
    masteryState: PropTypes.arrayOf(
      React.PropTypes.shape({
        name: string.isRequired,
        branch: string.isRequired,
        activePoints: number.isRequired
      }),
    )
  }

  static defaultProps = {
    masteries: {}
  }

  componentDidMount() {
    this.props.loadMasteries()
  }

  onClick = () => {
    this.props.resetMastery();
  }

  render() {
    const self = this;

    const renderedMasteries = map(this.props.masteries, (branch, branchName) => {
      const tiers = map(branch, (tierMasteries, tierIndex) => {
        const masteries = map(tierMasteries, mastery => (
          <TalentNode
            {...this.props}
            {...mastery}
            onClick={() => self.onMasteryClick(mastery, branch)}
            branch={branchName}
            key={mastery.name}/>
        ))

        return (<div key={branchName + tierIndex} styleName="mastery_layer">{masteries}</div>)
      });

      const cleanBranchName = branchName.replace(branchName.charAt(0), branchName.charAt(0).toUpperCase());

      return (
        <div key={branchName} styleName="mastery_branch">
          {tiers}
          <div styleName="mastery_branch_name">
            {cleanBranchName}
            {' '}
            {this.props.branchState[branchName]}
          </div>
        </div>
      )
    })

    return (
      <div styleName="mastery_wrapper">
        <div>
          <button styleName="mastery_return_button" onClick={this.onClick}>Return points</button>
          <div styleName="mastery_points_left">Points left : {this.props.pointsLeft}</div>
        </div>
        <div onMouseMove={this.onMouseMove}>
          {renderedMasteries}
        </div>
      </div>
    );
  }
}
