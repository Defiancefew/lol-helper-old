import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import cssModules from 'react-css-modules';
import * as searchActions from '../modules/search';
import * as summonerActions from '../modules/summoner';
import SummonerPortrait from '../components/summoner/Portrait/SummonerPortrait';
import SummonerStatsPortrait from '../components/summoner/Portrait/SummonerStatsPortrait';
import MostPlayedChampions from '../components/summoner/Portrait/SummonerMostPlayedChampions';
import Nav from '../components/summoner/Nav';
import styles from './Summoner.scss';

@connect(({ search, summoner }) => ({ search, summoner }), { ...searchActions, ...summonerActions })
@cssModules(styles)
export default class SummonerPanel extends PureComponent {
  componentWillMount() {
    this.props.searchChampions(_.toNumber(this.props.params.summonerId));
  }

  render() {
    const { summonerResult, data, leagueEntries } = this.props.search;
    const { recent, runes, masteries, team, mostPlayed } = this.props.summoner;
    const routerId = _.toNumber(this.props.params.summonerId);
    const singleSummoner = _.find(summonerResult, ['id', routerId]);

    if (!singleSummoner) {
      return null;
    }

    const statsPortraits = _.map(leagueEntries[routerId], (stats, key) => {
      return (
        <SummonerStatsPortrait key={key} stats={stats} />
      );
    });

    return (
      <div styleName="summoner_page_wrapper">
        <div>
          <div styleName="top_profile_wrapper">
            <div styleName="portraits_wrapper">
              <SummonerPortrait
                summonerLevel={singleSummoner.summonerLevel}
                profileIconId={singleSummoner.profileIconId}
              />
              <MostPlayedChampions
                data={data}
                mostPlayed={mostPlayed[routerId]}
              />
            </div>
            {statsPortraits}
            <div styleName="summoner_name">{singleSummoner.name}
              <Nav routerId={routerId} />
            </div>

          </div>
        </div>
        {this.props.children && React.cloneElement(this.props.children, this.props)}
      </div>
    );
  }
}
