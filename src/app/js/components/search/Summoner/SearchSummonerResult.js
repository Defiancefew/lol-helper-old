import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import { Link } from 'react-router';
import SearchIcon from '../../searchicon/searchIcon';
import styles from './SearchSummonerResult.scss';

const SummonerResult = (props) => {
  const { summonerResult, data, leagueEntries } = props;

  if (summonerResult.status) {
    return (<div>{summonerResult.status.status_code} {summonerResult.status.message}</div>)
  }

  const listOfSummoners = _.map(summonerResult, (summoner) => {
    const nodeInfo = props.data.profileicon[summoner.profileIconId];

    const renderStats = () => {
      if (!_.isEmpty(leagueEntries) && leagueEntries[summoner.id]) {
        const {
          division,
          leaguePoints,
          wins,
          losses
        } = leagueEntries[summoner.id][0].entries[0];
        const { name, tier, queue } = leagueEntries[summoner.id][0];

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
          <span style={{ verticalAlign: 'middle', display: 'inline-block', margin: '0 20px' }}>
            <SearchIcon nodeInfo={nodeInfo} />
          </span>
          <span style={{verticalAlign: 'middle'}}>{summoner.summonerLevel} {summoner.name} {renderStats()}</span>
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

