import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { debounce, reduce } from 'lodash';
import _ from 'lodash/fp';
import SearchAutoSuggest from './SearchAutoSuggest';
import SearchFilter from './SearchFilter';
import './SearchNode.scss';
import * as searchActions from '../../modules/search';

const cMap = _.map.convert({ cap: false });

@connect(({ search }) => ({ ...search }), { ...searchActions })
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: {},
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

  onClick = () => {
    this.setState({ value: '', suggestions: [] });
  }

  searchInData() {
    const filters = _.pickBy(filter => !!filter, this.props.filters);
    const searchPredicate = filteredItem => (this.state.value !== '' && new RegExp(this.state.value)
      .test(filteredItem.name));
    const iterateOverSuggestions = reduce(filters,
      (total, value, key) =>
        ({ ...total, [key]: _.pickBy(searchPredicate, this.props.data[key]) }), {});

    const suggestions = _.pickBy(suggestion => !_.isEmpty(suggestion), iterateOverSuggestions);

    this.setState({ suggestions, searching: false });
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
