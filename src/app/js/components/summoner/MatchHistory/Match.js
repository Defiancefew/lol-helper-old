import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import MatchNode from './MatchNode';
import styles from './Match.scss';

class MatchList extends Component {

  componentDidMount() {
    const { search, params, searchRecentGames } = this.props;

    if (_.isEmpty(search.summonerRecent[params.summonerId])) {
      searchRecentGames(params.summonerId);
    }
  }

  render() {
    const { summonerId } = this.props.params;
    const { summonerRecent, data } = this.props.search;
    // Team ID 100 is blue team. Team ID 200 is purple team.
    if (_.isEmpty(summonerRecent[summonerId])) {
      return null;
    }

    const { games } = summonerRecent[summonerId];
    const renderMatchList = _.map(games, (match, key) =>
      <MatchNode key={match.gameId} data={data} matchInfo={match} />
    );

    return (
      <div className={styles.matchWrapper}>{renderMatchList}</div>
    );
  }
}

export default MatchList;
