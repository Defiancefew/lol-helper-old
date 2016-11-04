import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './SummonerPortrait.scss';

const SummonerSoloPortrait = props => {
  // TODO Remake api to cache profile picture
  const { name, tier, queue, entries } = props.stats;
  const { division, leaguePoints, wins, losses } = entries[0];

  const queueType = queue.match(/SOLO/) ? 'SOLO' : 'TEAM';
  const queueFormat = queue.match(/5x5/) ? '5x5' : '3x5';

  const portraitStyle = {
    display: 'block',
    backgroundImage: `url(./img/tier/tier_icons/${tier.toLowerCase()}_${division.toLowerCase()}.png)`,
    width: '128px',
    height: '128px',
    backgroundSize: 'cover',
    margin: '0 auto'
  };

  return (
    <div styleName="stats_wrapper">
      <div>{queueType} {queueFormat}</div>
      <div style={portraitStyle} />
      <div>
        <div>{name} {division}</div>
        {leaguePoints} pts W: {wins} / L: {losses}
      </div>
    </div>
  );
};

export default cssModules(SummonerSoloPortrait, styles);
