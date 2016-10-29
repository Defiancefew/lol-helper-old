import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import { map, isEmpty } from 'lodash';
import SearchNode from './SearchNode';
import { Cogwheel } from '../Icons';
import styles from './Search.scss';

const Loading = <div><Cogwheel /> Loading...</div>;
const FindSummoner = props => (<div onClick={props.getSummoner(props.value)}>Find Summoner...</div>);

const SearchAutoSuggest = (props) => {
  const listOfSuggestions = map(props.suggestions, category =>
    map(category, (node, nodeName) => (
      <div key={nodeName}>
        <SearchNode {...props} {...node} />
      </div>
    )));

  // if (isEmpty(props.suggestions) && props.value) {
  //   return <div>Sorry,nothing found :(</div>;
  // }

  return (
    <div styleName="search_suggest_wrapper">
      {props.value ? <div onClick={() => props.getSummoner(props.value)}>Find Summoner</div> : null}
      <div>
        {props.searching ? Loading : listOfSuggestions}
      </div>
    </div>
  );
};

SearchAutoSuggest.propTypes = {
  suggestions: PropTypes.object,
  searching: PropTypes.bool.isRequired,
  getSummoner: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default cssModules(styles)(SearchAutoSuggest);
