import React, { Component, PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import * as talentActions from '../../modules/talents';
import { filter, map, isEmpty, eq, flow, groupBy, tap, conforms, chain, uniq, upperFirst } from 'lodash';
import CSSModules from 'react-css-modules';
import { isMasteryAvailable } from '../../helpers';

import TalentNode from './TalentNode';
import styles from './Talents.scss';

const { func, string, number } = PropTypes;

@connect(({ talents }) => ({ ...talents }), { ...talentActions })
@CSSModules(styles)
export default class TalentPanel extends Component {
  state = {
    mouseX: 0,
    mouseY: 0
  }

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

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps;
  }

  componentDidMount() {
    if (isEmpty(this.props.masteries)) {
      this.props.loadMasteries()
    }
  }

  onClick = () => {
    this.props.resetMastery();
  }

  onMouseMove = e => {
    this.setState({ mouseX: e.pageX, mouseY: e.pageY });
  }

  buildTree = () => {
    return chain(this.props.masteries)
      .map('branch')
      .uniq()
      .map(branchName => {
        const layers = chain(this.props.masteries)
          .filter(item => item.branch === branchName)
          .groupBy('tier')
          .map((tier, k) => {
              const masteries = map(tier, (mastery) => {
                const currentPoints = (this.props.masteryState[mastery.name])
                  ? this.props.masteryState[mastery.name].activePoints
                  : 0

                const {branchState, masteryState} = this.props

                return (
                  <div
                    key={mastery.name}
                    onMouseMove={this.onMouseMove}
                    onContextMenu={() => this.props.removeMastery({ ...mastery })}
                    onClick={() => this.props.addMastery({ ...mastery })}
                  >
                    <TalentNode
                      {...this.state}
                      {...this.props}
                      {...mastery}
                      active={isMasteryAvailable({ branchState, masteryState, mastery})}
                      currentPoints={currentPoints}
                    />
                  </div>
                )
              });

              return (<div key={k} styleName="mastery_layer">{masteries}</div>)
            }
          )
          .value();

        return (
          <div key={branchName} styleName="mastery_branch">
            {layers}
            <div styleName="mastery_branch_name">
              {upperFirst(branchName)}
              {' '}
              {this.props.branchState[branchName]}
            </div>
          </div>
        )
      })
      .value()
  }

  render() {
    return (
      <div styleName="mastery_wrapper">
        <div>
          <button styleName="mastery_return_button" onClick={this.onClick}>Return points</button>
          <div styleName="mastery_points_left">Points left :
            {this.props.pointsLeft}
          </div>
        </div>
        <div>
          {this.buildTree()}
        </div>
      </div>
    );
  }
}
