import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './SearchSummonerResult.scss';

const SummonerResult = (props) => {
  const listOfSummoners = _.map(props.summonerResult, (summoner) => {

    const image = props.data.profileicon[summoner.profileIconId].image;
    const computedStyle = {
      backgroundImage: `url(./img/sprites/${image.group}/${image.sprite})`,
      backgroundPosition: `${-image.x}px ${-image.y}px`,
      width: image.w,
      height: image.h,
      float: 'left',
      marginRight: '10px'
    };

    return (
      <div
        key={summoner.id}
        style={{
          lineHeight: '48px'
        }}>
        <div style={computedStyle}></div>
        <div>{summoner.summonerLevel} - {summoner.name}</div>
      </div>
    );
  });

  return (
    <div>
      {listOfSummoners}
    </div>
  );
};

SummonerResult.propTypes = {
  summonerResult: PropTypes.shape({}),
  data: PropTypes.shape({})
};

export default cssModules(styles)(SummonerResult);

