import React, { Component, PropTypes } from 'react';
import SearchIcon from '../../searchicon/searchIcon';

const MostPlayedChampions = ({ data, mostPlayed }) => {
  const renderList = _.map(mostPlayed, (champion, key) => {
    const { championId } = champion;
    const championName = data.champShortMap[championId];
    const championData = data.champion[championName];

    return (<SearchIcon key={key} nodeInfo={championData} />);
  });

  return (
    <div>
      {renderList}
    </div>
  );
};

export default MostPlayedChampions;
