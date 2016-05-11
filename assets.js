const getAssets = require('./tools/getAssets')

module.exports = () => getAssets([
  // 'purecss/build/base-min.css',
  // 'purecss/build/grids-core-min.css',
  // 'purecss/build/tables-min.css',
  '../src/favicon.ico',
  'es6-promise/dist/es6-promise.min.js',
  'whatwg-fetch/fetch.js',
  '../src/style/spinner.css',
  '../src/style/pure.css',
  '../src/style/code-mirror.css',
  '../src/layout/the-cook.css',
  '../src/layout/moulinette.css',
  '../src/layout/tab.css',
  'codemirror/lib/codemirror.css',
  'codemirror/theme/dracula.css',
])
