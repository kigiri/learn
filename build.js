function promisify(f){
  return function () {
    var a = Array.prototype.slice.call(arguments);

    return new Promise((s, j) =>
      f.apply(this, a.concat((err, val) => err ? j(err) : s(val))))
  }
}

const _ = require('lodash');
const fs = require('fs');
const config = require('./webpack.config');
const webpack = promisify(require('webpack'));
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const pass = _ => _;
const logAll = arr => _.each(arr, val => console.log(val));
const removeComments = data => data.toString('utf8')
  .replace(/(\/\*(.|\s)*?\*\/\s*)/g, () => '')
const toBase64 = data => data.toString('base64')

const handlers = {
  js: removeComments,
  css: removeComments,
  ico: toBase64,
}

const extractFile = (val, idx) => idx % 2
  ? readFile('./public/' + val)
      .catch(_ => '')
      .then(handlers[val.split(/\.([a-z]+)$/)[1]] || pass)
  : val;

function compileIndex() {
  return readFile('./src/index.html', { encoding: 'utf8' })
    .then(d => d.split(/\{(.+?)\}/))
    .then(d => Promise.all(_.map(d, extractFile)))
    .then(result => result.join(''))
    .then(data => writeFile('./public/index.html', data))
}

webpack(config)
  .then(build => {
    logAll([
      'webpack completed:',
      Math.round((build.endTime - build.startTime)) + ' milliseconds elapsed',
      'Compile of index.html...',
    ])
  })
  .then(compileIndex)
  // https://webpack.github.io/docs/node.js-api.html
  .catch(err => console.log(err))
  .then(() => console.log('all done !'))

