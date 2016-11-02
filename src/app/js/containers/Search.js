import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SummonerResult from '../components/search/Summoner/SearchSummonerResult';
import SearchInput from '../components/search/Input/SearchInput';
import TeamResult from '../components/search/Team/SearchTeamResult';
import * as searchActions from '../modules/search';

@connect(({ search }) => ({ ...search }), { ...searchActions })
export default class Search extends Component {
  static propTypes = {
    fetchData: PropTypes.func,
    teamResult: PropTypes.shape({}),
    data: PropTypes.shape({}),
    summonerResult: PropTypes.shape({})
  }

  componentDidMount() {
    if (!this.props.data) {
      this.props.fetchData();
    }
  }

  render() {
    return (
      <div>
        <SearchInput {...this.props} />
        <SummonerResult
          summonerStats={this.props.summonerStats}
          summonerResult={this.props.summonerResult}
          data={this.props.data} />
        <TeamResult teamResult={this.props.teamResult} />
      </div>
    );
  }
}
