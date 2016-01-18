/* eslint-disable no-console, no-use-before-define */
import Express from 'express';
import qs from 'qs';
import _debug from 'debug';
import config from '../config';

import webpack from 'webpack';
import webpackConfig from '../build/webpack.config';

import React from 'react';
import { renderToString } from 'react-dom/server';
// import { Provider } from 'react-redux';

import Html from './../src/helpers/Html';
import Root from './../src/containers/Root';
import configureStore from '../src/redux/configureStore';
import { createMemoryHistory } from 'react-router';
import { Provider } from 'react-redux';
import routes from './../src/routes';
// import App from '../src/containers/App';
// import { fetchCounter } from '../src/api/counter';

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
  // app.use(Express.static(paths.client('static')));
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
  var webpackStats = require('./webpack_stats.json');
  // const historyConfig = {
  //   basename: ''
  // };
  // debug('handleRender', useRouterHistory);
  const history = createMemoryHistory();
  const initialState = {};
  const store = configureStore({});
  const component = (
    <Root history={history} routes={routes} store={store} />
  );

  res.send('<!doctype html>\n' +
    renderToString(<Html assets={{
      styles: webpackStats.css,
      javascript: [webpackStats.vendor[0], webpackStats.script[0]]
    }} component={component} store={store}/>));
}

export default app;
