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
  state = {}

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

  renderBranches() {
    return map(this.props.masteries, (branch, branchName) => {
      const tiers = map(branch, (tierMasteries, key) => {
        const masteries = map(tierMasteries, mastery => {
          return (<TalentNode
            masteryState={this.props.masteryState}
            addMastery={this.props.addMastery}
            removeMastery={this.props.removeMastery}
            branch={branchName}
            branchState={this.props.branchState}
            {...mastery}
            mouseX={this.state.mouseX}
            mouseY={this.state.mouseY}
            key={mastery.name}/>);
        })

        return (<div key={key} styleName="mastery_layer">{masteries}</div>)
      });

      return (
        <div key={branchName} styleName="mastery_branch">
          {tiers}
          <div styleName="mastery_branch_name">
            {branchName.replace(branchName.charAt(0), branchName.charAt(0).toUpperCase())}
            {' '}
            {this.props.branchState[branchName]}
          </div>
        </div>
      )
    })
  }

  onClick = () => {
    this.props.resetMastery();
  }

  onMouseMove = (e) => {
    this.setState({ mouseX: e.pageX, mouseY: e.pageY });
  }

  render() {
    return (
      <div styleName="mastery_wrapper">
        <div>
          <button styleName="mastery_return_button" onClick={this.onClick}>Return points</button>
          <div styleName="mastery_points_left">Points left : {this.props.pointsLeft}</div>
        </div>
        <div onMouseMove={this.onMouseMove}>
          {this.renderBranches()}
        </div>
      </div>
    );
  }
}