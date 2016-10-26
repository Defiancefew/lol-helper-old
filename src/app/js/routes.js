import React from 'react';
import { hashHistory, Router, Route, IndexRoute } from 'react-router';
import App from './components/App';
import NotFound from './components/NotFound';
import Home from './components/Home';
import Talents from './components/talents';
import Search from './components/search';

export const routes = (
  <div>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="talents" component={Talents} />
      <Route path="search" component={Search} />
    </Route>
    <Route path="*" component={NotFound} />
  </div>
);