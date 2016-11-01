import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './TalentTree.scss';
import offlineMasterydata from '../../../../offline/mastery.json';
import TalentNode from './TalentNode';
import { isMasteryAvailable } from '../../helpers';

const Tree = (props) => {
  const branches = _.map(offlineMasterydata.tree, (branch, branchName) => {
    const layers = _.map(branch, (tier, tierKey) => {
      const pointsReq = props.pointsReqArray[tierKey];
      const compactTier = _.compact(tier);
      const masteries = _.map(compactTier, (masteryObject) => {
        const masteryId = masteryObject.masteryId;
        const masteryData = offlineMasterydata.data[masteryId];
        const { branchState, masteryState } = props;
        const currentPoints = (masteryState[masteryData.name])
          ? masteryState[masteryData.name].activePoints
          : 0;
        const mastery = {
          name: masteryData.name,
          branch: branchName,
          description: masteryData.description,
          tier: tierKey,
          image: masteryData.image,
          rank: masteryData.ranks,
          pointsReq,
          active: (tierKey === 0)
        };

        return (<TalentNode
          {..._.omit(props, 'styles')}
          key={mastery.name}
          mastery={mastery}
          currentPoints={currentPoints}
          active={isMasteryAvailable({ branchState, masteryState, mastery })}
        />);
      });

      return (
        <div key={tierKey} styleName="mastery_layer">{masteries}</div>
      );
    });

    return (
      <div key={branchName} styleName="mastery_branch">
        {layers}
        <div styleName="mastery_branch_name">
          {_.upperFirst(branchName)}
          {' '}
          {props.branchState[branchName]}
        </div>
      </div>
    );
  });

  return (
    <div>{branches}</div>
  );
};

// TODO Add PropTypes

export default cssModules(styles)(Tree);
