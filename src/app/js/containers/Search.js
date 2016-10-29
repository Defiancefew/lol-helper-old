import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import cssModules from 'react-css-modules';
import SearchAutoSuggest from '../components/search/SearchAutoSuggest';
import SearchFilter from '../components/search/SearchFilter';
import styles from '../components/search/Search.scss';
import * as searchActions from '../modules/search';
import Regions from '../components/search/SearchRegions';

@connect(({ search }) => ({ ...search }), { ...searchActions })
@cssModules(styles)
export default class Search extends Component {
  static propTypes = {
    fetchData: PropTypes.func,
    searchData: PropTypes.func,
    searchStart: PropTypes.func,
    cleanSuggestions: PropTypes.func,
    changeFilter: PropTypes.func,
    filters: PropTypes.shape({})
  }

  debouncedSearch = debounce(searchValue => this.props.searchData(searchValue), 1000)

  componentDidMount() {
    this.props.fetchData();
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
    this.props.searchData(this.search.value);
  }

  render() {
    return (
      <div>
        <div styleName="search_input_wrapper">
          <Regions
            selectRegion={this.props.selectRegion}
            regions={this.props.regions}
            selectedRegion={this.props.selectedRegion}
          />
          <input
            onChange={this.onChange}
            type="text"
            ref={(c) => {
              this.search = c;
            }}
          />
          <button onClick={this.onClick}>x</button>
          <SearchFilter filters={this.props.filters} changeFilter={this.props.changeFilter} />
        </div>
        <div>
          <SearchAutoSuggest
            chooseValue={this.chooseValue}
            {...this.props}
          />
        </div>
      </div>
    );
  }
}
