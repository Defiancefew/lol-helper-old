import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import DevTools from './DevTools';
import ssss from './App.scss';

export default props => {
  return (
    <div>
      <ul>
        <li className="nav_list"><Link className="nav" activeClassName="nav_active" to="/">Home</Link></li>
        <li className="nav_list"><Link className="nav" activeClassName="nav_active" to="/talents">Talents</Link></li>
      </ul>
      <div>
        {props.children}
      </div>
      {(process.env.NODE_ENV === 'production') ? null : <DevTools />}
    </div>
  );
}
