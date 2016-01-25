localStorage.debug = 'app:*';
import _debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './../routes';
import configureStore from '../redux/configureStore';
import { createForClient } from '../helpers/rootComponent';

// import App from '../src/containers/App';
const initialState = window.__INITIAL_STATE__;
const destEle = document.getElementById('content');
const store = configureStore(browserHistory, initialState);
const debug = _debug('app:clinet');

function clientRender(store, dest) {
  debug('clientRender');
  if (__DEBUG__ && !window.devToolsExtension) {
    const DevTools = require('./../containers/DevTools').default;
    return createForClient(store, {
      routes: routes,
      history: browserHistory,
      devComponent: (<DevTools />)
    })
      .then(function({root}) {
        debug('got root');
        ReactDOM.render(
          root,
          dest
        );
      });
  }
}

const component = (
  <Router history={browserHistory}>
      {routes}
  </Router>
);

debug('render first');
ReactDOM.render(
  <Provider store={store} key='provider'>
    {component}
  </Provider>,
  destEle
);
debug('render first finished');

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!destEle || !destEle.firstChild || !destEle.firstChild.attributes || !destEle.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

clientRender(store, destEle);
