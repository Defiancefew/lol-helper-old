import React, { Component, PropTypes } from 'react';
import SearchIcon from '../searchicon/searchIcon';
import styles from './FreeToPlay.scss';

export default ({ champions, data }) => {
  const championsList = _.map(champions, champion => {
    const championName = data.champShortMap[champion.id];
    const championData = data.champion[championName];

    return <SearchIcon key={champion.id} nodeInfo={championData} />
  });

  return (
    <div className={styles.wrapper}>
      {championsList}
    </div>
  );
}