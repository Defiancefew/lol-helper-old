import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { Router, hashHistory } from 'react-router';
import { routes } from './routes';
import globalStyles from '../sass/global.scss';
import fonts from '../sass/fonts.scss';

const store = configureStore();

render(
  <Provider store={store}>
    <Router history={hashHistory} routes={routes} />
  </Provider>,
  document.getElementById('root')
);