'use strict';
// A webpack plugin to write webpack stats that can be consumed when rendering
// the page (e.g. it attach the public path to the script names)
// These stats basically contains the path of the script files to
// <script>-load in the browser.

import fs from 'fs';
import path from 'path';
const debug = require('debug')('app:build:webpack:plugins:write_stats');
debug('in write_stats', __dirname);
const filepath = path.resolve(__dirname, './../../server/webpack_stats.json');
debug('filepath', filepath);
// Write only a relevant subset of the stats and attach the public path to it

function writeStats(stats) {
  debug('writeStats');
  const publicPath = this.options.output.publicPath;

  const json = stats.toJson();

  // get chunks by name and extensions
  function getChunks(name, ext) {
    ext = ext || 'js';
    let chunk = json.assetsByChunkName[name];

    // a chunk could be a string or an array, so make sure it is an array
    if (!(Array.isArray(chunk))) {
      chunk = [chunk];
    }

    return chunk
      .filter(chunk => path.extname(chunk) === `.${ext}`) // filter by extension
      .map(chunk => `${publicPath}${chunk}?${Date.now()}`); // add public path to it
  }

  const script = getChunks('app', 'js');
  const vendor = getChunks('vendor', 'js');
  const css = getChunks('main', 'css');

  const content = {
    script: script,
    vendor: vendor,
    css: css
  };

  fs.writeFileSync(filepath, JSON.stringify(content));

};

export default writeStats;
