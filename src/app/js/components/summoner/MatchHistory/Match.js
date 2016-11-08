import React, { PureComponent, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import MatchNode from './MatchNode';
import styles from './Match.scss';

class MatchList extends PureComponent {

  componentDidMount() {
    const { search, params, searchRecentGames, summoner } = this.props;

    if (_.isEmpty(summoner.recent[params.summonerId])) {
      searchRecentGames(params.summonerId);
    }
  }

  render() {
    const { summonerId } = this.props.params;
    const { recent } = this.props.summoner;
    const { data } = this.props.search;
    // Team ID 100 is blue team. Team ID 200 is purple team.
    if (_.isEmpty(recent[summonerId])) {
      return null;
    }

    const { games } = recent[summonerId];
    const renderMatchList = _.map(games, (match, key) =>
      <MatchNode key={match.gameId} data={data} matchInfo={match} />
    );

    return (
      <div className={styles.matchWrapper}>{renderMatchList}</div>
    );
  }
}

export default MatchList;
