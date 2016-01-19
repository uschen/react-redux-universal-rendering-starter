// import WebpackIsomorphicTools from 'webpack-isomorphic-tools';
// import config from './../config';

export default () => {
  // const toolsConfig = require('../../config/webpack-isomorphic-tools.config.js');
  // const tools = new WebpackIsomorphicTools(toolsConfig);
  // tools
    // .development(__DEV__)
    // .server(config.path_base);
  return global.webpackIsomorphicTools;
};
