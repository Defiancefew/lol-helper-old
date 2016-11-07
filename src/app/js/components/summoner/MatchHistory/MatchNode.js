import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import SearchIcon from '../../searchicon/searchIcon';
import styles from './MatchNode.scss';

const MatchNode = ({ data, matchInfo }) => {
  const championName = data.champShortMap[matchInfo.championId];
  const championData = data.champion[championName];
  const { stats, spell1, spell2, mapId, subType } = matchInfo;
  const gameType = subType.split('_').map(word => word.toLowerCase()).join(' ');

  const mapName = data['map'][mapId].MapName
    .replace('New', '')
    .replace(/([A-Z])/g, ' $1');

  const teamStyle = {
    backgroundColor: `${stats.win ? 'green' : 'red'}`,
    width: '10px',
    height: '48px',
    display: 'inline-block'
  };

  const summoners = [spell1, spell2].map((spellId) => {
    const spellData = _.find(data.summoner, ['key', `${spellId}`]);
    return <SearchIcon key={spellId} nodeInfo={spellData} />;
  });

  const listOfItems = _.times(7, Number).map((number) => {
    const itemId = matchInfo.stats[`item${number}`];
    const itemData = data.item[itemId];

    return <SearchIcon key={number} nodeInfo={itemData} />;
  });

  return (
    <div styleName="match_node_wrapper">
      <div styleName="champion_icons_wrapper">
        <div style={teamStyle} />
        <SearchIcon nodeInfo={championData} level={stats.level} />
        {summoners}
      </div>
      <div styleName="stats_wrapper">
        <div styleName={'location_wrapper'}>
          <div>({gameType})</div>
          <div>{mapName}</div>
          <div>{_.capitalize(matchInfo.gameMode)} </div>
        </div>
        <span
          styleName="stats_win"
          style={{ color: `${stats.win ? 'green' : 'red'}` }}
        >
          {stats.win ? 'Victory' : 'Defeat'}
        </span>
        <span styleName="stats_kills">{stats.championsKilled} | {stats.numDeaths} | {stats.assists}</span>
      </div>
      {listOfItems}
    </div>
  );
};

export default cssModules(MatchNode, styles);