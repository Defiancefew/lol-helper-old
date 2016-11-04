import React, { Component, PropTypes } from 'react';

const MatchNode = ({ data, matchInfo }) => {
  const championName = data.champShortMap[matchInfo.championId];
  const championData = data.champion[championName];
  const { image } = championData;
  const { stats } = matchInfo;

  // TODO Remake to a single reusable component

  const champIcon = {
    backgroundImage: `url(./img/sprites/champion/${image.sprite})`,
    backgroundPosition: `${-image.x}px ${-image.y}px`,
    width: image.w,
    height: image.h,
    display: 'inline-block'
  };

  return (
    <div>
      <div style={{ backgroundColor: `${matchInfo.teamId === 200 ? purple : blue}` }} />
      <div style={champIcon} />
      <span style={{ color: `${stats.win ? 'green' : 'red'}` }}>{stats.win ? 'Victory' : 'Defeat'}</span>
    </div>
  );
};

class MatchList extends Component {

  componentDidMount() {
    this.props.searchRecentGames(this.props.params.summonerId);
  }

  render() {
    // Team ID 100 is blue team. Team ID 200 is purple team.

    const matchList = this.props.search.summonerRecent.games;

    const renderMatchList = _.map(matchList, (match, id) => {

    });

    return (
      <div>This is matchlist</div>
    );
  }

}

export default MatchList;
