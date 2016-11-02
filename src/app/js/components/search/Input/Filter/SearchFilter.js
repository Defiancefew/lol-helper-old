import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import { FilterIcon } from '../../../Icons';
import styles from './SearchFilter.scss';

class Filter extends Component {
  state = { opened: false };

  render() {
    const filterIcon = (
      <div
        styleName="filter_icon"
        onClick={() => this.setState({ opened: !this.state.opened })}>
        <FilterIcon />
      </div>
    );

    if (!this.state.opened) {
      return <div styleName="filter_wrapper">{filterIcon}</div>;
    }

    const listOfFilters = _.map(this.props.filters, (filter, key) =>
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
      <div styleName="filter_wrapper">
        <div>{filterIcon}</div>
        <div styleName="filter_list_wrapper">{listOfFilters}</div>
      </div>
    );
  }
}

Filter.propTypes = {
  filters: PropTypes.shape({}),
  changeFilter: PropTypes.func.isRequired
};


export default cssModules(styles)(Filter);

