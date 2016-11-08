import React, { PureComponent, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import SearchFilter from './Filter/SearchFilter';
import SearchAutoSuggest from './AutoSuggest/SearchAutoSuggest';
import Regions from './Regions/SearchRegions';
import styles from './SearchInput.scss';
import { Cancel } from '../../Icons';

class SearchInput extends PureComponent {
  debouncedSearch = _.debounce(searchValue => this.props.searchOfflineData(searchValue), 1000)
  throttledStart = _.throttle(() => this.props.searchStart(), 2000)

  static propTypes = {
    search: PropTypes.shape({
      searching: PropTypes.bool.isRequired,
      value: PropTypes.string.isRequired,
      regions: PropTypes.shape({}),
      filters: PropTypes.shape({}),
      selectedRegion: PropTypes.shape({}),
    }),
    selectRegion: PropTypes.func.isRequired,
    changeFilter: PropTypes.func.isRequired,
    getSummoner: PropTypes.func.isRequired,
    searchOfflineData: PropTypes.func.isRequired,
    searchStart: PropTypes.func,
    cleanSuggestions: PropTypes.func,
  }

  onChange = (e) => {
    this.throttledStart();
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
    const { selectedRegion, regions, value, filters, suggestions, searching } = this.props.search;

    return (
      <div>
        <div styleName="wrapper">
          <Regions
            selectRegion={this.props.selectRegion}
            regions={regions}
            selectedRegion={selectedRegion}
          />
          <span styleName="inputWrapper">
            <input
              placeholder="Search here..."
              styleName="input"
              onChange={this.onChange}
              type="text"
              ref={(c) => {
                this.search = c;
              }}
            />
            <button styleName="clean" onClick={this.onClick}>
              <Cancel style={{ fill: 'white' }} width="12px" height="12px" />
            </button>
          </span>
          <button
            styleName="search"
            onClick={() => {
              this.props.getSummoner(this.search.value);
              this.props.getLeagueEntries(this.search.value);
            }}
          >
            Search
          </button>
          <SearchFilter filters={filters} changeFilter={this.props.changeFilter} />
        </div>
        <div>
          <SearchAutoSuggest
            chooseValue={this.chooseValue}
            suggestions={suggestions}
            value={value}
            getSummoner={this.props.getSummoner}
            searching={searching}
          />
        </div>
      </div>
    );
  }
}

export default cssModules(SearchInput, styles);
