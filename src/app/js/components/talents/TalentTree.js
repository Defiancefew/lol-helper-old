import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { flow, map, filter, uniq, groupBy, upperFirst } from 'lodash/fp';
import styles from './Talents.scss';
import { isMasteryAvailable } from '../../helpers';
import TalentNode from './TalentNode';

const { string, number, bool } = PropTypes;

const TalentTree = (props) => {
  const branchNames = flow(map('branch'), uniq)(props.masteries);
  const prepareTree = map((branchName) => {
    const layers = flow(
      filter(item => item.branch === branchName),
      groupBy('tier'),
      map.convert({ cap: false })((tier, tierIndex) => {
        const masteries = map((mastery) => {
          const { branchState, masteryState } = props;
          const currentPoints = (masteryState[mastery.name])
            ? masteryState[mastery.name].activePoints
            : 0;

          return (
            <TalentNode
              key={mastery.name}
              {...props}
              mastery={mastery}
              active={isMasteryAvailable({ branchState, masteryState, mastery })}
              currentPoints={currentPoints}
            />
          );
        }, tier);

        return (
          <div key={tierIndex} styleName="mastery_layer">{masteries}</div>
        );
      })
    )(props.masteries);

    return (
      <div key={branchName} styleName="mastery_branch">
        {layers}
        <div styleName="mastery_branch_name">
          {upperFirst(branchName)}
          {' '}
          {props.branchState[branchName]}
        </div>
      </div>
    );
  }, branchNames);

  return (<div>{prepareTree}</div>);
};

TalentTree.propTypes = {
  masteries: PropTypes.objectOf(PropTypes.shape({
    name: string.isRequired,
    branch: string.isRequired,
    description: PropTypes.arrayOf(string),
    tier: string.isRequired,
    rank: string.isRequired,
    pointsReq: string.isRequired,
    active: bool.isRequired,
    activePoints: number
  })),
  branchState: PropTypes.shape({
    Cunning: number,
    Ferocity: number,
    Resolve: number
  }),
  masteryState: PropTypes.objectOf(PropTypes.shape({
    name: string.isRequired,
    branch: string.isRequired,
    description: PropTypes.arrayOf(string),
    tier: string.isRequired,
    rank: string.isRequired,
    pointsReq: string.isRequired,
    active: bool.isRequired,
    activePoints: number.isRequired
  }))
};

export default CSSModules(styles)(TalentTree);
