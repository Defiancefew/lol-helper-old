import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cssModules from 'react-css-modules';
import { isEmpty } from 'lodash';
import * as talentActions from '../modules/talents';
import Tree from '../components/talents/TalentTree';
import styles from '../components/talents/Talents.scss';

const { string, number } = PropTypes;

@connect(({ talents }) => ({ ...talents }), { ...talentActions })
@cssModules(styles)
export default class TalentPanel extends Component {
  state = {
    mouseX: 0,
    mouseY: 0
  }

  static propTypes = {
    masteries: PropTypes.object,
    pointsLeft: PropTypes.number,
    masteryState: PropTypes.arrayOf(
      PropTypes.shape({
        name: string.isRequired,
        branch: string.isRequired,
        activePoints: number.isRequired
      })
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps;
  }

  componentDidMount() {
    if (isEmpty(this.props.masteries)) {
      this.props.loadMasteries();
    }
  }

  onClick = () => {
    this.props.resetMastery();
  }

  onMouseMove = e => {
    this.setState({ mouseX: e.pageX, mouseY: e.pageY });
  }

  render() {
    return (
      <div styleName="mastery_wrapper">
        <div>
          <button styleName="mastery_return_button" onClick={this.onClick}>Return points</button>
          <span styleName="mastery_points_left">Points left :
            {this.props.pointsLeft}
          </span>
        </div>
        <div onMouseMove={this.onMouseMove}>
          <Tree {...this.state} {..._.omit(this.props, 'styles')} />
        </div>
      </div>
    );
  }
}
