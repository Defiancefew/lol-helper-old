import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './SummonerPortrait.scss';

const SummonerPortrait = props => {
  const { summonerLevel, profileIconId } = props;
    // TODO Remake api to cache profile picture
    const portraitStyle = {
      display: 'block',
      backgroundImage: `url(http://ddragon.leagueoflegends.com/cdn/6.21.1/img/profileicon/${profileIconId}.png)`,
      width: '128px',
      height: '128px',
      backgroundSize: 'cover'
    };

    return (
      <div styleName="summoner_wrapper">
        <div style={portraitStyle}></div>
        <div styleName="summoner_level">{summonerLevel}</div>
      </div>
    );
};

export default cssModules(SummonerPortrait, styles)