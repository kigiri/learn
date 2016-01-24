const getAssets = require('./tools/getAssets')

module.exports = () => getAssets([
  // 'purecss/build/base-min.css',
  // 'purecss/build/grids-core-min.css',
  // 'purecss/build/tables-min.css',
  '../src/favicon.ico',
  'purecss/build/pure-min.css',
  'es6-promise/dist/es6-promise.min.js',
  'whatwg-fetch/fetch.js',
]);
