import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

const Nav = ({ routerId }) => {
  return (<div>
    <ul>
      <li className="nav_list">
        <Link className="nav" activeClassName="nav_active" to={`summoner/${routerId}/match`}>Match</Link>
      </li>
      <li className="nav_list">
        <Link className="nav" activeClassName="nav_active" to={`summoner/${routerId}/runes`}>Runes</Link>
      </li>
      <li className="nav_list">
        <Link className="nav" activeClassName="nav_active" to={`summoner/${routerId}/masteries`}>Masteries</Link>
      </li>
    </ul>
  </div>)
}

export default Nav;