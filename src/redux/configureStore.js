import thunk from 'redux-thunk';
// import { map } from 'lodash';
import rootReducer from './rootReducer';
import { applyMiddleware, compose, createStore } from 'redux';
import { syncHistory } from 'redux-simple-router';
import fetchrMiddleware from './middlewares/fetchrMiddleware';
// import createLogger from 'redux-logger';

function hmr(store) {
  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default;
      store.replaceReducer(nextRootReducer);
    });
  }
}

function withDevTools(middlewares) {
  const devTools = window.devToolsExtension
    ? window.devToolsExtension()
    : require('./../containers/DevTools').default.instrument();
  return compose(middlewares, devTools);
}

/**
 * https://github.com/bdefore/universal-redux/blob/master/src/shared/create.js
 *
 * @param {[type]} options.providedMiddlewares [description]
 * @param {[type]} options.history             [description]
 * @param {[type]} options.data                [description]
 * @return {[type]} [description]
 */
export default function configureStore(history, initialState) {
  const routerMiddleware = syncHistory(history);
  const useDevtools = __DEV__ && __CLIENT__ && __DEBUG__;
  // Compose final middleware and use devtools in debug environment
  var middleware = applyMiddleware(thunk, routerMiddleware, fetchrMiddleware());
  if (useDevtools) {
    middleware = withDevTools(middleware);
  }

  const store = middleware(createStore)(rootReducer, initialState);
  hmr(store);
  return store;
}
