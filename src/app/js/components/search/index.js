import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import _ from 'lodash/fp';
// import cssModules from 'react-css-modules';
import { data } from '../../../../offline/items.json';
import SearchAutoSuggest from './SearchAutoSuggest';
import Filter from './SearchFilter';
import './SearchNode.scss';
import * as searchActions from '../../modules/search';

@connect(({ search }) => ({ ...search }), { ...searchActions })
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      searchValue: [],
      searching: false
    };
    this.delayedSearchInData = debounce(this.searchInData, 300);
  }

  onChange = (e) => {
    this.setState({ value: e.target.value, searching: e.target.value !== '' });
    this.delayedSearchInData();
  }

  searchInData() {
    const searchValue = _.flow(
      _.map.convert({ cap: false })((item, key) => ({ id: key, ...item })),
      _.filter(filteredItem =>
        (this.state.value !== '' && new RegExp(this.state.value).test(filteredItem.name))))(data);

    this.setState({ searchValue, searching: false });
  }

  onClick = () => {
    this.setState({ value: '', searchValue: [] });
  }

  chooseValue = (name) => {
    this.setState({ value: name }, this.searchInData);
  }

  render() {
    return (
      <div>
        <Filter filters={this.props.filters} />
        <input value={this.state.value} onChange={this.onChange} type="text" />
        <button onClick={this.onClick}>x</button>
        <SearchAutoSuggest
          chooseValue={this.chooseValue}
          suggestions={this.state.searchValue}
          searching={this.state.searching}
        />
      </div>
    );
  }
}
