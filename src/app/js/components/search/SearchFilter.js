import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import { map } from 'lodash';
import { FilterIcon } from '../Icons';
import styles from './Search.scss';

class Filter extends Component {
  state = { opened: false };

  render() {
    const filterIcon = (
      <div
        onClick={() => this.setState({ opened: !this.state.opened })}>
        <FilterIcon />
      </div>
    );

    if (!this.state.opened) {
      return <div>{filterIcon}</div>;
    }

    const listOfFilters = map(this.props.filters, (filter, key) =>
      (
        <div key={key}>
          <label htmlFor={key}>
            <input
              id={key}
              onClick={() => this.props.changeFilter(key)}
              type="checkbox" defaultChecked="true"
              value={this.props.filters[key]}
            />
            {key}
          </label>
        </div>
      ));

    return (
      <div styleName="search_filter_wrapper">
        <div>{filterIcon}</div>
        <div styleName="search_filter_list_wrapper">{listOfFilters}</div>
      </div>
    );
  }
}


export default cssModules(styles)(Filter);

