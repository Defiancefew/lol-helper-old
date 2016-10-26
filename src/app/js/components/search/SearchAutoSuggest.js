import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import { map, isEmpty } from 'lodash';
import SearchNode from './SearchNode';
import { Cogwheel } from '../Icons';

const SearchAutoSuggest = (props) => {
  if (isEmpty(props.suggestions)) {
    return <div>Sorry,nothing found :(</div>
  }

  if (props.searching) {
    return <div><Cogwheel /> Loading...</div>
  }

  const listOfSuggestions = map(props.suggestions, (item) => {
    return (
      <div key={item.id}>
        <SearchNode {...props} {...item} />
      </div>
    );
  });

  return (
    <div>
      {listOfSuggestions}
    </div>
  );
};

SearchAutoSuggest.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.shape({})),
  searching: PropTypes.bool.isRequired
};

export default SearchAutoSuggest;
