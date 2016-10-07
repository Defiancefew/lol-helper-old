import React, { PropTypes, Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './Talents.scss';
import { find } from 'lodash';
import { rankPointsSum, calculatePointsLeft } from '../../modules/talents';

const { string, func, number } = PropTypes;

@CSSModules(styles)
export default class TalentNode extends Component {
  state = {}

  static propTypes = {
    name: string.isRequired,
    branch: string.isRequired,
    rank: string.isRequired,
    tier: string.isRequired,
    description: string.isRequired,
    pointsReq: string.isRequired,
    addMastery: func.isRequired,
    removeMastery: func.isRequired,
    masteryState: PropTypes.object.isRequired
  }

  onMouseEnter() {
    this.setState({ mousemoving: true });
  }

  onMouseLeave() {
    this.setState({ mousemoving: false });
  }

  onMouseMove(e) {
    this.setState({ mouseX: e.pageX, mouseY: e.pageY });
  }

  onClick(e) {
    const { name, rank, tier, pointsReq, branch } = this.props;
    this.props.addMastery({ name, rank, tier, pointsReq, branch });
  }

  onContextMenu() {
    const { name, rank, tier, pointsReq, branch } = this.props;
    this.props.removeMastery({ name, rank, tier, pointsReq, branch });
  }

  getCurrentMasteryPoints() {
    const foundMastery = find(this.props.masteryState, { name: this.props.name });

    if (foundMastery) {
      return foundMastery.activePoints;
    }

    return 0;
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
        backgroundImage: `url(./img/${encodeURIComponent(this.props.name)}.png)`,
        filter: this.isMasteryAvailable() ? 'none' : 'grayscale(100%)'
      },
      description: {
        top: `${this.state.mouseY}px`,
        left: `${this.state.mouseX + 20}px`
      }
    }

    return (
      <div styleName="mastery_icon_wrapper">
        <div style={computedStyles.masteryIcon}
             styleName="mastery_icon"
             onMouseLeave={::this.onMouseLeave}
             onMouseEnter={::this.onMouseEnter}
             onMouseMove={::this.onMouseMove}
             onClick={::this.onClick}
             onContextMenu={::this.onContextMenu}
        >
          <div styleName="mastery_count">{this.getCurrentMasteryPoints()}/{this.props.rank}</div>
        </div>
        <div style={computedStyles.description} styleName="mastery_description">
          <div>{decodeURIComponent(this.props.name).replace(/\_+/g, ' ')}</div>
          {this.props.description}
        </div>
      </div>
    );
  }
}
