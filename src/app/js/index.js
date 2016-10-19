import React from 'react';
import Immutable from 'immutable';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { Router, hashHistory } from 'react-router';
import { routes } from './routes';

import '!style!css!normalize-css/normalize.css';
import '!style!css!sass!../sass/fonts.scss';
import '!style!css!sass!../sass/global.scss';

const store = configureStore();

render(
  <Provider store={store}>
    <Router history={hashHistory} routes={routes}/>
  </Provider>,
  document.getElementById('root')
);
