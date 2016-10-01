import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DevTools from './DevTools';
import { Link } from 'react-router';

@connect()
export default class App extends Component {

  render() {
    return (
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/talents">Talents</Link></li>
        </ul>
        <div>
          {this.props.children}
        </div>
        {(process.env.NODE_ENV === 'production') ? null : <DevTools />}
      </div>
    );
  }
}