import _debug from 'debug';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';

const debug = _debug('app:helpers:rootComponent');

export function createForServer(store, renderProps) {
  debug('createForServer');
  return new Promise((resolve, reject) => {
    loadOnServer(renderProps, store)
      .then(() => {
        const root = (
          <Provider store={store} key='provider'>
              <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );
        debug('createForServer', 'got root', 'store', store.getState());
        resolve({ root });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function createForClient(store, { routes, history, devComponent }) {
  debug('createForClient');
  const component = (
    <Router history={history}>
      {routes}
    </Router>
  );
  const root = (
    <Provider store={store} key='provider'>
      <div>
        {component}
        {devComponent}
      </div>
    </Provider>
  );

  return Promise.resolve({ root });
}
