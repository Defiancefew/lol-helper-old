import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import DevTools from './DevTools';
import * as freetoplayActions from '../modules/ftp';
import * as searchActions from '../modules/search';
import FreeToPlay from '../components/freetoplay/FreeToPlay';

@connect(({ ftp, search }) => ({ ftp, search }), { ...freetoplayActions, ...searchActions })
export default class App extends Component {
  componentDidMount() {
    if (!this.props.search.data) {
      this.props.fetchData();
    }

    if (!this.props.ftp.champions) {
      this.props.fetchFtpChampions();
    }
  }

  render() {
    return (
      <div>
        <div style={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
          <nav style={{ display: 'inline-block' }}>
            <ul>
              <li className="nav_list">
                <Link className="nav" activeClassName="nav_active" to="/">Home</Link>
              </li>
              <li className="nav_list">
                <Link className="nav" activeClassName="nav_active" to="/talents">Talents</Link>
              </li>
              <li className="nav_list">
                <Link className="nav" activeClassName="nav_active" to="/search">Search</Link>
              </li>
            </ul>
          </nav>
          <FreeToPlay champions={this.props.ftp.champions} data={this.props.search.data} />
        </div>
        <div>
          {this.props.children}
        </div>
        {(process.env.NODE_ENV === 'production') ? null : <DevTools />}
      </div>
    );
  }
}

