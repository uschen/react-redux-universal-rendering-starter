//  enable runtime transpilation to use ES6/7 in node

/* eslint-disable */
var fs = require('fs');
var path = require('path');

var babelrc = fs.readFileSync(path.resolve(__dirname, '../.babelrc'));
var babelConfig;

try {
  babelConfig = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your babelrc');
  console.error(err);
}

/* eslint-enable */

require('babel-register')(babelConfig);

const config = require('../config');
const debug = require('debug')('app:bin:server');

/**
 * Define isomorphic constants.
 */
global.__DEV__ = config.env.development;
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEBUG__ = config.globals.__DEBUG__;
global.__DISABLE_SSR__ = false; // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEBUG_NEW_WINDOW__ = false;

const port = config.server_port;

const app = require('./../src/server/app');
// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../src/server/webpack-isomorphic-tools.config.js'))
  .development(__DEV__);

global.webpackIsomorphicTools
  .server(config.path_base, function() {
    debug('will start server');
    app.use(require('./../src/server/render'));
    app.listen(port);
    debug('Server is now running at localhost:' + port + '.');
  });
