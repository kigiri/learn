function promisify(f){
  return function () {
    var a = Array.prototype.slice.call(arguments);

    return new Promise((s, j) =>
      f.apply(this, a.concat((err, val) => err ? j(err) : s(val))))
  }
}

const _ = require('lodash');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const pathJoin = require('path').join;
const nodeModule = path => pathJoin(__dirname, 'node_modules', path);
const addArray = (src, key, val) => ((src[key]
  ? src[key].push(val)
  : src[key] = [val]), src);

const getExt = path => path.split(/\.(.+?$)/)[1] || 'js';
const assetGetter = (acc, path) => addArray(acc, getExt(path), readFile(path));
const assets = {};

const removeComments = data => data.toString('utf8')
  .replace(/(\/\*(.|\s)*?\*\/\s*)/g, () => '')
const toBase64 = data => data.toString('base64')

const handlers = {
  js: removeComments,
  css: removeComments,
  ico: toBase64,
}

const saveAsset = ext => val => assets[ext] = val.map(handlers[ext]).join('\n')

module.exports = () => Promise.all(_([
  // 'purecss/build/base-min.css',
  // 'purecss/build/grids-core-min.css',
  // 'purecss/build/tables-min.css',
  'purecss/build/pure-min.css',
  ]).chain()
    .map(nodeModule)
    .reduce(assetGetter, {})
    .map((q, ext) => Promise.all(q).then(saveAsset(ext)))
    .value())
  .then(() => assets)
  .catch(console.log)