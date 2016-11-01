import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './SearchTeamResult.scss';
import TeamNode from './SearchTeamNode';

const TeamResult = (props) => {
  const listOfSummoners = _.map(props.teamResult, (bySummoner, summonerId) => {
    const listOfTeams = _.map(bySummoner, (team) => {
      return (<TeamNode key={team.name} team={team} />);
    });
    return <div key={summonerId}>{listOfTeams}</div>;
  });

  return <div>{listOfSummoners}</div>;
};

TeamResult.propTypes = {
  teamResult: PropTypes.shape({})
};

export default cssModules(styles)(TeamResult);
