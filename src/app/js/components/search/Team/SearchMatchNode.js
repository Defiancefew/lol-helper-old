import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './SearchTeamResult.scss';

const MatchNode = (props) => {
  const { match, team } = props;
  return (
    <div styleName="history_wrapper">
      {match.win
        ? <span style={{ color: 'green' }}>WIN </span>
        : <span style={{ color: 'red' }}>LOSE </span>}
      {team.name} | {match.kills} | {match.opposingTeamKills} | {match.opposingTeamName}</div>
  );
};

export default cssModules(styles)(MatchNode);
