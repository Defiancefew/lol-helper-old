import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import { Link } from 'react-router';
import SearchIcon from '../../searchicon/searchIcon';
import styles from './SearchSummonerResult.scss';

const SummonerResult = (props) => {
  const { summonerResult, data, summonerStats } = props;

  if (summonerResult.status) {
    return (<div>{summonerResult.status.status_code} {summonerResult.status.message}</div>)
  }

  const listOfSummoners = _.map(summonerResult, (summoner) => {
    const nodeInfo = props.data.profileicon[summoner.profileIconId];
    // const image = props.data.profileicon[summoner.profileIconId].image;
    // const computedStyle = {
    //   backgroundImage: `url(./img/sprites/${image.group}/${image.sprite})`,
    //   backgroundPosition: `${-image.x}px ${-image.y}px`,
    //   width: image.w,
    //   height: image.h
    // };

    const renderStats = () => {
      if (!_.isEmpty(summonerStats) && summonerStats.leagueEntries[summoner.id]) {
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
      <Link style={{ textDecoration: 'none' }} key={summoner.id} to={`summoner/${summoner.id}`}>
        <div styleName="container">
          <span style={{ verticalAlign: 'top', display: 'inline-block', margin: '0 20px' }}>
            <SearchIcon nodeInfo={nodeInfo} />
          </span>
          {summoner.summonerLevel} {summoner.name} {renderStats()}
        </div>
      </Link>
    );
  });

  return (
    <div >
      {listOfSummoners}
    </div>
  );
};

SummonerResult.propTypes = {
  summonerResult: PropTypes.shape({}),
  data: PropTypes.shape({})
};

export default cssModules(styles)(SummonerResult);

