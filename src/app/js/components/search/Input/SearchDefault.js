import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './Node/SearchNode.scss';

const SearchDefault = props => {

  return (
    <div>
      <a styleName="search_node" onClick={() => props.getData(props.value)}>
        <div styleName="search_champion"></div>
        <div styleName="search_node_text">{props.children}</div>
      </a>
    </div>
  );
};

export default cssModules(styles)(SearchDefault);
