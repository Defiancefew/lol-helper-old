import React from 'react';
import { Link } from 'react-router';

const notFound = () => (
  <div>Sorry, page not found
    <Link to="/">Go home</Link>
  </div>
);

export default notFound;
