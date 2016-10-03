import React, { Component } from 'react';
import { connect } from 'react-redux';
import DevTools from './DevTools';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from './App.scss';

@CSSModules(styles)
@connect()
export default class App extends Component {

  render() {
    return (
      <div>
        <ul>
          <li><Link activeClassName="nav_active" to="/">Home</Link></li>
          <li><Link activeClassName="nav_active" to="/talents">Talents</Link></li>
        </ul>
        <div>
          {this.props.children}
        </div>
        {(process.env.NODE_ENV === 'production') ? null : <DevTools />}
      </div>
    );
  }
}