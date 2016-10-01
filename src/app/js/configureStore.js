import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { persistState } from 'redux-devtools';
import DevTools from './components/DevTools';
import { combineReducers } from 'redux';
import * as reducers from './modules';

const logger = createLogger({ collapsed: true });

export default function configureStore(initialState) {
  const store = createStore(
    combineReducers(reducers),
    initialState, compose(
      applyMiddleware(
        thunk,
        logger),
      DevTools.instrument(),
      persistState(
        window.location.href.match(
          /[?&]debug_session=([^&]+)\b/
        )
      )));
  if (module.hot) {
    module.hot.accept('./modules', () => {
      const nextRootReducer = require('./modules');
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
