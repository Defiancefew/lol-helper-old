import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import _ from 'lodash/fp';
// import cssModules from 'react-css-modules';
import { data } from '../../../../offline/item.json';
import SearchAutoSuggest from './SearchAutoSuggest';
import SearchFilter from './SearchFilter';
import './SearchNode.scss';
import * as searchActions from '../../modules/search';
import { FilterIcon } from '../Icons';

@connect(({ search }) => ({ ...search }), { ...searchActions })
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: [],
      searching: false
    };
    this.delayedSearchInData = debounce(this.searchInData, 300);
  }

  componentDidMount() {
      this.props.fetchData();
  }

  onChange = (e) => {
    this.setState({ value: e.target.value, searching: e.target.value !== '' });
    this.delayedSearchInData();
  }

  searchInData() {
    const suggestions = _.flow(
      _.map.convert({ cap: false })((item, key) => ({ id: key, ...item })),
      _.filter(filteredItem =>
        (this.state.value !== '' && new RegExp(this.state.value).test(filteredItem.name))))(data);

    this.setState({ suggestions, searching: false });
  }

  onClick = () => {
    this.setState({ value: '', suggestions: [] });
  }

  chooseValue = (name) => {
    this.setState({ value: name }, this.searchInData);
  }

  render() {
    return (
      <div>
        <SearchFilter filters={this.props.filters} changeFilter={this.props.changeFilter} />
        <input value={this.state.value} onChange={this.onChange} type="text" />
        <button onClick={this.onClick}>x</button>
        <SearchAutoSuggest
          chooseValue={this.chooseValue}
          {...this.state}
        />
      </div>
    );
  }
}
