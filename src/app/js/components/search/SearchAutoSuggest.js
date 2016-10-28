import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import { map, isEmpty } from 'lodash';
import SearchNode from './SearchNode';
import { Cogwheel } from '../Icons';
import styles from './SearchNode.scss';

const SearchAutoSuggest = (props) => {
  if (isEmpty(props.suggestions) && props.value) {
    return <div>Sorry,nothing found :(</div>;
  }

  if (props.searching) {
    return <div><Cogwheel /> Loading...</div>;
  }

  const listOfSuggestions = map(props.suggestions, (category) => {
    return map(category, (node,nodeName) => {
      return (
        <div key={nodeName}>
          <SearchNode {...props} {...node} />
        </div>
      )
    })
    // return (
    //   <div key={item.id}>
    //     <SearchNode {...props} {...item} />
    //   </div>
    // );
  });

  return (
    <div styleName="search_suggest_wrapper">
      {listOfSuggestions}
    </div>
  );
};

SearchAutoSuggest.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.shape({})),
  searching: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired
};

export default cssModules(styles)(SearchAutoSuggest);
