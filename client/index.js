import React from 'react';
import ReactDOM from 'react-dom';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import routes from './../src/routes';
import Root from './../src/containers/Root';
import configureStore from '../src/redux/configureStore';
// import App from '../src/containers/App';

const historyConfig = {
  basename: __BASENAME__
};
const history = useRouterHistory(createHistory)(historyConfig);

const initialState = window.__INITIAL_STATE__;
const store = configureStore({
  initialState,
  history
});

// Render the React application to the DOM
ReactDOM.render(
  <Root history={history} routes={routes} store={store} />,
  document.getElementById('root')
);
