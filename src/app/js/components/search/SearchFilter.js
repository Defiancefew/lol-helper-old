import React, { Component, PropTypes } from 'react';
import { map } from 'lodash';
import { FilterIcon } from '../Icons';

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
              type="checkbox" defaultChecked={true}
              value={this.props.filters[key]}
            />
            {key}
          </label>
        </div>
      ));

    return (
      <div>
        {filterIcon}
        {listOfFilters}
      </div>
    );
  }
}


export default Filter;
