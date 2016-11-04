import React, { Component, PropTypes } from 'react';

const MostPlayedChampions = ({ data, mostPlayed }) => {
  const renderList = _.map(mostPlayed, (champion, key) => {
    const { championId, championPoints } = champion;
    const championName = data.champShortMap[championId];
    const championData = data.champion[championName];
    const { image } = championData;
    const computedStyle = {
      backgroundImage: `url(./img/sprites/champion/${image.sprite})`,
      backgroundPosition: `${-image.x}px ${-image.y}px`,
      width: image.w,
      height: image.h,
      display: 'inline-block'
    };

    // TODO Add floating description
    const description = <div>{championData.name}, {championData.title}</div>;

    return (<div key={key} style={computedStyle} />);
  });

  return (
    <div>
      {renderList}
    </div>
  );
};

export default MostPlayedChampions;
