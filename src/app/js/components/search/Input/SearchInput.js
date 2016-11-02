import React, { Component, PropTypes } from 'react';
import { debounce } from 'lodash';
import cssModules from 'react-css-modules';
import SearchFilter from './Filter/SearchFilter';
import SearchAutoSuggest from './AutoSuggest/SearchAutoSuggest';
import Regions from './Regions/SearchRegions';
import styles from './SearchInput.scss';
import { Cancel } from '../../Icons';

class SearchInput extends Component {
  debouncedSearch = debounce(searchValue => this.props.searchOfflineData(searchValue), 1000)

  static propTypes = {
    selectRegion: PropTypes.func.isRequired,
    changeFilter: PropTypes.func.isRequired,
    getSummonerStats: PropTypes.func.isRequired,
    searchOfflineData: PropTypes.func.isRequired,
    searchStart: PropTypes.func,
    cleanSuggestions: PropTypes.func,
    selectedRegion: PropTypes.shape({}),
    regions: PropTypes.shape({}),
    filters: PropTypes.shape({})
  }

  onChange = (e) => {
    this.props.searchStart();
    e.persist();
    this.debouncedSearch(e.target.value);
  }

  onClick = () => {
    this.search.value = '';
    this.props.cleanSuggestions();
  }

  chooseValue = (name) => {
    this.search.value = name;
    this.props.searchOfflineData(this.search.value);
  }

  render() {
    return (
      <div>
        <div>
          <Regions
            selectRegion={this.props.selectRegion}
            regions={this.props.regions}
            selectedRegion={this.props.selectedRegion}
          />
          <input
            styleName="input_type"
            onChange={this.onChange}
            type="text"
            ref={(c) => {
              this.search = c;
            }}
          />
          <button styleName="input_clean" onClick={this.onClick}><Cancel width="12px" height="12px" /></button>
          <button styleName="input_search" onClick={() => this.props.getSummoner(this.props.value)}>Search</button>
          <SearchFilter filters={this.props.filters} changeFilter={this.props.changeFilter} />
        </div>
        <div>
          <SearchAutoSuggest
            chooseValue={this.chooseValue}
            suggestions={this.props.suggestions}
            value={this.props.value}
            getSummoner={this.props.getSummoner}
            getTeam={this.props.getTeam}
            searching={this.props.searching}
          />
        </div>
      </div>
    );
  }
}

export default cssModules(SearchInput, styles);