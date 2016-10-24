import React from 'react';
import '!style!css!sass!../../../node_modules/normalize-css/normalize.css';
import '!style!css!sass!../sass/global.scss';
import '!style!css!sass!../sass/fonts.scss';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import configureStore from './configureStore';
import { routes } from './routes';

const store = configureStore();

render(
  <Provider store={store}>
    <Router history={hashHistory} routes={routes}/>
  </Provider>,
  document.getElementById('root')
);
