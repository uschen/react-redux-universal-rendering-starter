/* eslint-disable no-console, no-use-before-define */
import Express from 'express';
import qs from 'qs';
import _debug from 'debug';
import config from '../config';

import webpack from 'webpack';
import webpackConfig from '../build/webpack.config';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import configureStore from '../src/stores/configureStore';
import App from '../src/containers/App';
import { fetchCounter } from '../src/api/counter';

import webpackStats from './webpack_stats.json';

const debug = _debug('app:server');
const paths = config.utils_paths;
const app = new Express();

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
  const compiler = webpack(webpackConfig);

  // Enable webpack-dev and webpack-hot middleware
  const {publicPath} = webpackConfig.output;

  app.use(require('./middlewares/webpack-dev')(compiler, publicPath));
  app.use(require('./middlewares/webpack-hmr')(compiler));

  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(Express.static(paths.client('static')));
} else {
  debug(
    'Server is being run outside of live development mode. This starter kit ' +
    'does not provide any production-ready server functionality. To learn ' +
    'more about deployment strategies, check out the "deployment" section ' +
    'in the README.'
  );

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(Express.static(paths.base(config.dir_dist)));
}
// This is fired every time the server side receives a request
app.use(handleRender);

function handleRender(req, res) {
  // Query our mock API asynchronously
  fetchCounter(apiResult => {
    // Read the counter from the request, if provided
    const params = qs.parse(req.query);
    const counter = parseInt(params.counter, 10) || apiResult || 0;

    // Compile an initial state
    const initialState = {
      counter
    };

    // Create a new Redux store instance
    const store = configureStore(initialState);

    // Render the component to a string
    const html = renderToString(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Grab the initial state from our Redux store
    const finalState = store.getState();

    // Send the rendered page back to the client
    res.send(renderFullPage(html, finalState));
  });
}

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="${webpackStats.vendor}"></script>
        <script src="${webpackStats.script}"></script>
      </body>
    </html>
    `;
}

export default app;
