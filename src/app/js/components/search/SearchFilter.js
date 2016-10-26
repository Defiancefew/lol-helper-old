import React, { Component, PropTypes } from 'react';
import { map } from 'lodash';

const Filter = (props) => {
  const listOfFilters = map(props.filters, (filter, key) =>
    (<div key={key}>
      <label htmlFor={key}>
        <input id={key} type="checkbox" value={props.filters[key]} /> {key}
      </label>
    </div>));

  return (
    <div>
      {listOfFilters}
    </div>
  );
};

export default Filter;
