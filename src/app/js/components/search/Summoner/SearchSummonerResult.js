import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './SearchSummonerResult.scss';

const SummonerResult = (props) => {
  const { summonerResult, data, summonerStats } = props;

  if (summonerResult.status) {
    return (<div>{summonerResult.status.status_code} {summonerResult.status.message}</div>)
  }

  const listOfSummoners = _.map(summonerResult, (summoner) => {
    const image = props.data.profileicon[summoner.profileIconId].image;
    const computedStyle = {
      backgroundImage: `url(./img/sprites/${image.group}/${image.sprite})`,
      backgroundPosition: `${-image.x}px ${-image.y}px`,
      width: image.w,
      height: image.h
    };

    const renderStats = () => {
      if (!_.isEmpty(summonerStats)) {
        const {
          division,
          leaguePoints,
          wins,
          losses
        } = summonerStats.leagueEntries[summoner.id][0].entries[0];
        const { name, tier, queue } = summonerStats.leagueEntries[summoner.id][0];

        const statsComputedStyle = {
          backgroundImage: `url(./img/tier/base/${tier.toLowerCase()}.png`,
          width: '50px',
          height: '50px',
          display: 'inline-block',
          verticalAlign: 'middle',
          backgroundSize: 'cover'
        };

        return (
          <span>
            <div style={statsComputedStyle} />
            {tier} {division} {leaguePoints} pts {wins}/{losses}
          </span>);
      }

      return null;
    };

    return (
      <div styleName="summoner_wrapper" key={summoner.id}>
        <div styleName="summoner_icon" style={computedStyle} />
        <div>{summoner.summonerLevel} - {summoner.name} {renderStats()}</div>
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

