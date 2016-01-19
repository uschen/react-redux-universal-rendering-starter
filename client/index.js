import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './../src/routes';
import configureStore from '../src/redux/configureStore';
// import App from '../src/containers/App';
const initialState = window.__INITIAL_STATE__;
const destEle = document.getElementById('content');
const store = configureStore(browserHistory, initialState);

function clientRender(component, store, dest) {
  if (__DEBUG__ && !window.devToolsExtension) {
    const DevTools = require('./../src/containers/DevTools').default;
    ReactDOM.render(
      <Provider store={store} key='provider'>
        <div>
          {component}
          <DevTools />
        </div>
      </Provider>,
      dest
    );
  }
}

const component = (
  <Router history={browserHistory}>
    {routes}
  </Router>
);

ReactDOM.render(
  <Provider store={store} key='provider'>
    {component}
  </Provider>,
  destEle
);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!destEle || !destEle.firstChild || !destEle.firstChild.attributes || !destEle.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

clientRender(component, store, destEle);
