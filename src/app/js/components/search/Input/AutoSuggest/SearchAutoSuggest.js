import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import SearchNode from '../Node/SearchNode';
import { Cogwheel } from '../../../Icons';
import SearchDefault from '../SearchDefault';
import styles from './SearchAutoSuggest.scss';

const Loading = <div styleName="cogwheel"><Cogwheel /> Loading...</div>;

const SearchAutoSuggest = (props) => {
  const listOfSuggestions = _.map(props.suggestions, category =>
    _.map(category, (node, nodeName) => (
      <div key={nodeName}>
        <SearchNode chooseValue={props.chooseValue} {...node} />
      </div>
    )));

  return (
    <div styleName="suggest_wrapper">
        {props.searching ? Loading : listOfSuggestions}
    </div>
  );
};

SearchAutoSuggest.propTypes = {
  suggestions: PropTypes.shape({}),
  searching: PropTypes.bool.isRequired,
  value: PropTypes.string

};

export default cssModules(SearchAutoSuggest, styles);
