import React, { PropTypes, Component, PureComponent } from 'react';
import CSSModules from 'react-css-modules';
import styles from './Talents.scss';
import { find } from 'lodash';
import { rankPointsSum, calculatePointsLeft } from '../../helpers';

const { string, func, number, arrayOf } = PropTypes;

@CSSModules(styles)
export default class TalentNode extends PureComponent {
  state = {}

  static propTypes = {
    name: string.isRequired,
    branch: string.isRequired,
    rank: string.isRequired,
    tier: string.isRequired,
    description: arrayOf(string).isRequired,
    pointsReq: string.isRequired,
    addMastery: func.isRequired,
    removeMastery: func.isRequired,
    masteryState: PropTypes.object.isRequired
  }

  onMouseMove = e => {
    this.setState({ mouseX: e.pageX, mouseY: e.pageY });
  }

  onContextMenu = () => {
    const { name, rank, tier, pointsReq, branch } = this.props;
    this.props.removeMastery({ name, rank, tier, pointsReq, branch });
  }

  onClick = () => {
    const { name, rank, tier, pointsReq, branch } = this.props;
    this.props.addMastery({ name, rank, tier, pointsReq, branch });
  }

  getCurrentMasteryPoints() {
    const {masteryState, name} = this.props;
    const foundMastery = find(masteryState, { name });

    if (foundMastery) {
      return foundMastery.activePoints;
    }

    return 0;
  }

  getCurrentDescription() {
    const {masteryState, description, name} = this.props;
    const foundMastery = find(masteryState, { name });

    if (description) {
      if (foundMastery && foundMastery.activePoints > 0) {
        return description[foundMastery.activePoints - 1];
      }
      return description[0];
    }

    return 'loading';
  }

  isMasteryAvailable() {
    const { pointsReq, rank, name, masteryState, branchState, branch } = this.props;

    if (calculatePointsLeft(branchState) < 0) { // Return false if no points left
      return (masteryState[name] && masteryState[name].activePoints > 0); // Return false if mastery is not active
    }

    if (pointsReq <= branchState[branch]) { // Mastery has enough points required by branch
      if (rankPointsSum(pointsReq, rank) <= branchState[branch]) { // Mastery has enough points left per tier
        return (masteryState[name] && masteryState[name].activePoints > 0); // Mastery had active points
      }
      return true;
    }
  }

  render() {
    const computedStyles = {
      masteryIcon: {
        backgroundImage: `url(./img/${encodeURIComponent(this.props.name)}${this.isMasteryAvailable() ? '' : '-bw'}.png)`,
        border: `1px solid ${this.isMasteryAvailable() ? 'yellow' : 'gray'}`
      },
      description: {
        top: `${this.state.mouseY}px`,
        left: `${this.state.mouseX + 20}px`
      },
      masteryCount: {
        border: `1px solid ${this.isMasteryAvailable() ? 'yellow' : 'lightgray'}`,
        color: `${this.isMasteryAvailable() ? 'yellow' : 'lightgray'}`
      }
    }

    return (
      <div styleName="mastery_icon_wrapper" onMouseMove={this.onMouseMove}>
        <div onClick={this.onClick} style={computedStyles.masteryIcon}
          styleName="mastery_icon"
          onContextMenu={this.onContextMenu}
          >
          <div
            style={computedStyles.masteryCount}
            styleName="mastery_count">{this.getCurrentMasteryPoints()}/{this.props.rank}
          </div>
        </div>
        <div style={computedStyles.description} styleName="mastery_description">
          <div>{decodeURIComponent(this.props.name).replace(/\_+/g, ' ')}</div>
          <br />
          {this.getCurrentDescription()}
        </div>
      </div>
    );
  }
}
