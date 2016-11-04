import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import cssModules from 'react-css-modules';
import * as searchActions from '../modules/search';
import SummonerPortrait from '../components/summoner/Portrait/SummonerPortrait';
import SummonerStatsPortrait from '../components/summoner/Portrait/SummonerStatsPortrait';
import MostPlayedChampions from '../components/summoner/Portrait/SummonerMostPlayedChampions';
import styles from './Summoner.scss';

@connect(({ search, summoner }) => ({ search, summoner }), { ...searchActions })
@cssModules(styles)
export default class SummonerPanel extends PureComponent {
  componentWillMount() {
    this.props.searchChampions(parseFloat(this.props.params.summonerId, 10));
  }

  render() {
    const { summonerResult, summonerStats, data } = this.props.search;
    const routerId = parseInt(this.props.params.summonerId, 10);
    const singleSummoner = _.find(summonerResult, ['id', routerId]);

    if (!singleSummoner) {
      return null;
    }

    const statsPortraits = _.map(summonerStats.leagueEntries[routerId], (stats, key) => {
      return (
        <SummonerStatsPortrait key={key} stats={stats} />
      );
    });

    return (
      <div>
        <SummonerPortrait
          summonerLevel={singleSummoner.summonerLevel}
          profileIconId={singleSummoner.profileIconId}
        />
        {statsPortraits}
        <div styleName="summoner_name">{singleSummoner.name}</div>
        <MostPlayedChampions
          data={data}
          mostPlayed={summonerStats.mostPlayed[routerId]}
        />
        <div>
          <ul>
            <li className="nav_list">
              <Link className="nav" activeClassName="nav_active" to={`summoner/${routerId}/match`}>Match</Link>
            </li>
            <li className="nav_list">
              <Link className="nav" activeClassName="nav_active" to={`summoner/${routerId}/runes`}>Runes</Link>
            </li>
            <li className="nav_list">
              <Link className="nav" activeClassName="nav_active" to={`summoner/${routerId}/masteries`}>Masteries</Link>
            </li>
          </ul>
        </div>
        <div>
          {this.props.children && React.cloneElement(this.props.children, this.props)}
        </div>
      </div>
    );
  }
}
