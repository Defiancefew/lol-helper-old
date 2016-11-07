import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { hashHistory } from 'react-router';
import { routerMiddleware, push } from 'react-router-redux';
import createLogger from 'redux-logger';
import { persistState } from 'redux-devtools';
import rootReducer from '../modules';
import DevTools from '../components/DevTools';

const logger = createLogger({
  level: 'info',
  collapsed: true
});

const router = routerMiddleware(hashHistory);

/**
 * Warning from React Router, caused by react-hot-loader.
 * The warning can be safely ignored, so filter it from the console.
 * Otherwise you'll see it every time something changes.
 * See https://github.com/gaearon/react-hot-loader/issues/298
 */
if (module.hot) {

  const orgError = console.error; // eslint-disable-line no-console
  console.error = (...args) => { // eslint-disable-line no-console
    if (args && args.length === 1 && _.isString(args[0]) && args[0].indexOf('You cannot change <Router routes>;') > -1) {
      // React route changed
    } else {
      // Log the error as normally
      orgError.apply(console, args);
    }
  };
}

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState, compose(
      applyMiddleware(
        thunk,
        router,
        logger),
      DevTools.instrument(),
      persistState(
        window.location.href.match( // eslint-disable-line
          /[?&]debug_session=([^&]+)\b/
        )
      )));

  if (module.hot) {
    module.hot.accept('../modules', () =>
      store.replaceReducer(require('../modules').default) // eslint-disable-line global-require
    );
  }

  return store;
}
