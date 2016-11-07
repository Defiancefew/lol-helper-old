import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import MatchNode from './MatchNode';
import styles from './Match.scss';

class MatchList extends Component {

  componentDidMount() {
    if (_.isEmpty(this.props.search.summonerRecent)) {
      this.props.searchRecentGames(this.props.params.summonerId);
    }
  }

  render() {
    // Team ID 100 is blue team. Team ID 200 is purple team.
    if (_.isEmpty(this.props.search.summonerRecent)) {
      return null;
    }

    const { games } = this.props.search.summonerRecent;
    const renderMatchList = _.map(games, (match, key) =>
      <MatchNode key={match.gameId} data={this.props.search.data} matchInfo={match} />
    );

    return (
      <div className={styles.matchWrapper}>{renderMatchList}</div>
    );
  }
}

export default MatchList;
