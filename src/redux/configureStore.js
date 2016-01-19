import thunk from 'redux-thunk';
// import { map } from 'lodash';
import rootReducer from './rootReducer';
import { applyMiddleware, compose, createStore } from 'redux';
import { syncHistory } from 'redux-simple-router';
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

// context: https://github.com/rackt/redux-simple-router/compare/1.0.2...2.0.2
// context: https://github.com/rackt/redux-simple-router/pull/141#issuecomment-167587581
// function linkDevtoolsToRouter(routerMiddleware, store) {
//   routerMiddleware.listenForReplays(store);
// }

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
  // const defaultMiddlewares = [router];
  // backward compatibility to 2.x api expecting object for middleware instead of array:
  // const customMiddlewares = !providedMiddlewares.concat ? map(providedMiddlewares, (m) => {
  //   return m;
  // }) : providedMiddlewares;
  // const middlewares = customMiddlewares.concat(defaultMiddlewares);
  // if (__CLIENT__ && __LOGGER__) {
  //   middlewares.push(createLogger({
  //     collapsed: true
  //   }));
  // }
  const useDevtools = __DEV__ && __CLIENT__ && __DEBUG__;
  // Compose final middleware and use devtools in debug environment
  var middleware = applyMiddleware(thunk, routerMiddleware);
  if (useDevtools) {
    middleware = withDevTools(middleware);
  }

  const store = middleware(createStore)(rootReducer, initialState);
  // const store = finalCreateStore(rootReducer, initialState);
  if (__DEBUG__) {
    // linkDevtoolsToRouter(router, store);
  }
  hmr(store);
  return store;
}
