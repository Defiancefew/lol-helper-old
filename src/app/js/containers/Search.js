import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import SummonerResult from '../components/search/Summoner/SearchSummonerResult';
import SearchInput from '../components/search/Input/SearchInput';
// import TeamResult from '../components/search/Team/SearchTeamResult';
import * as searchActions from '../modules/search';
import * as summonerActions from '../modules/summoner';

@connect(({ search, summoner }) => ({ search, summoner }), { ...searchActions, ...summonerActions })
export default class Search extends PureComponent {
  static propTypes = {
    search: PropTypes.shape({
      teamResult: PropTypes.shape({}),
      data: PropTypes.shape({}),
      summonerResult: PropTypes.shape({})
    }),
    summoner: PropTypes.shape({
      summonerResult: PropTypes.shape({})
    }),
    fetchData: PropTypes.func
  }

  componentDidMount() {
    if (!this.props.search.data) {
      this.props.fetchData();
    }
  }

  render() {
    return (
      <div>
        <SearchInput {..._.omit(this.props, 'styles')} />
        <SummonerResult
          leagueEntries={this.props.search.leagueEntries}
          summonerResult={this.props.search.summonerResult}
          data={this.props.search.data}
        />
        {/*<TeamResult teamResult={this.props.teamResult} />*/}
      </div>
    );
  }
}
