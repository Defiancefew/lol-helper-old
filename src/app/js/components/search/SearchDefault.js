import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './Search.scss';

const SearchDefault = props => {

  return (
    <div>
      <a onClick={() => props.chooseValue(props.name)} styleName="search_node">
        <div styleName="search_image" style={computedStyle}></div>
        <div styleName="search_node_text">{props.name}</div>
      </a>
  </div>
  )
}

export default cssModules(styles)(SearchDefault)