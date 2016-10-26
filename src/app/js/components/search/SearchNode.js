import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
const { number, string, func } = PropTypes;
import styles from './SearchNode.scss';

const SearchNode = (props) => {
  const computedStyle = {
    backgroundImage: `url(./img/items/${props.image.sprite})`,
    backgroundPosition: `${-props.image.x}px ${-props.image.y}px`,
    width: props.image.w,
    height: props.image.h
  };

  return (
    <a onClick={() => props.chooseValue(props.name)} styleName="search_node">
      <div style={computedStyle}></div>
      {props.name}
    </a>
  );
};

SearchNode.propTypes = {
  image: PropTypes.shape({
    sprite: string.isRequired,
    w: number.isRequired,
    h: number.isRequired,
    x: number.isRequired,
    y: number.isRequired
  }),
  name: string.isRequired,
  chooseValue: func.isRequired

};

export default cssModules(styles)(SearchNode);
