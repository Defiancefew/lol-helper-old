import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { persistState } from 'redux-devtools';
import rootReducer from './modules';
import DevTools from './components/DevTools';

const logger = createLogger({ collapsed: true });

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState, compose(
      applyMiddleware(
        thunk,
        logger),
      DevTools.instrument(),
      persistState(
        window.location.href.match( // eslint-disable-line
          /[?&]debug_session=([^&]+)\b/
        )
      )));
  if (module.hot) {
    module.hot.accept('./modules/index', () => {
      const nextRootReducer = require('./modules/index').default; // eslint-disable-line
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
