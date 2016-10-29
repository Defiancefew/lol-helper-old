import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
const { number, string, func } = PropTypes;
import styles from './Search.scss';

const SearchNode = (props) => {
  const imagePath = (group) => {
    if (group === 'gray_mastery') {
      return 'mastery';
    } else if (group === 'spell') {
      return 'summoner';
    }

    return group;
  };

  const computedStyle = {
    backgroundImage: `url(./img/sprites/${imagePath(props.image.group)}/${props.image.sprite})`,
    backgroundPosition: `${-props.image.x}px ${-props.image.y}px`,
    width: props.image.w,
    height: props.image.h
  };

  return (
    <a onClick={() => props.chooseValue(props.name)} styleName="search_node">
      <div styleName="search_image" style={computedStyle}></div>
      <div styleName="search_node_text">{props.name}</div>
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
