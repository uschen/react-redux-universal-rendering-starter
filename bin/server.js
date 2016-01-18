require('babel-register');

const config = require('../config');
const server = require('../server');
const debug = require('debug')('app:bin:server');

/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEBUG__ = config.globals.__DEBUG__;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__DEBUG_NEW_WINDOW__ = false;

const port = config.server_port;

server.listen(port);
debug('Server is now running at localhost:' + port + '.');
