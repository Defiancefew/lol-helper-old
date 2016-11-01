import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import SearchNode from '../Node/SearchNode';
import { Cogwheel } from '../../../Icons';
import SearchDefault from '../SearchDefault';
import styles from './SearchAutoSuggest.scss';

const Loading = <div styleName="cogwheel"><Cogwheel /> Loading...</div>;

const SearchDefaults = props => (<div>
  <SearchDefault
    value={props.value}
    getData={props.getSummoner}
  >
    Search summoner
  </SearchDefault>
  <SearchDefault
    value={props.value}
    getData={props.getTeam}
  >
    Search team
  </SearchDefault>
</div>);

SearchDefaults.propTypes = {
  value: PropTypes.string.isRequired,
  getSummoner: PropTypes.func.isRequired,
  getTeam: PropTypes.func.isRequired
};

const SearchAutoSuggest = (props) => {
  const listOfSuggestions = _.map(props.suggestions, category =>
    _.map(category, (node, nodeName) => (
      <div key={nodeName}>
        <SearchNode chooseValue={props.chooseValue} {...node} />
      </div>
    )));

  return (
    <div styleName="suggest_wrapper">
      {props.value ? <SearchDefaults {...props} /> : null}
      <div>
        {props.searching ? Loading : listOfSuggestions}
      </div>
    </div>
  );
};

SearchAutoSuggest.propTypes = {
  suggestions: PropTypes.shape({}),
  searching: PropTypes.bool.isRequired,
  value: PropTypes.string

};

export default cssModules(SearchAutoSuggest, styles);
