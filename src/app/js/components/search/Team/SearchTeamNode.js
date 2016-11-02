import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './SearchTeamResult.scss';
import { Select } from '../../Icons';
import MatchNode from './SearchMatchNode';

class TeamNode extends Component {
  state = {
    historyHidden: true
  }

  renderMatchHistory() {
    const matchHistory = _.map(
      this.props.team.matchHistory, (match) => {
        return (<MatchNode team={this.props.team} match={match} key={match.gameId} />);
      });

    return (
      <div onClick={() => this.setState({ historyHidden: !this.state.historyHidden })}>
        <Select transform={this.state.historyHidden ? '' : 'rotate(90,130,147)'} />
        Match history:
        {this.state.historyHidden ? null : matchHistory}
      </div>
    );
  }

  render() {
    const { team } = this.props;
    const created = new Date(team.createDate).toDateString();
    const lastGame = new Date(team.lastGameDate).toDateString();

    return (
      <div >
        <div styleName="team_name">{team.name} - [{team.tag}] - {team.status}</div>
        <div>Created : {created} </div>
        <div>Last game : {lastGame} </div>
        {this.renderMatchHistory()}
      </div>
    );
  }
}

export default cssModules(styles)(TeamNode);
