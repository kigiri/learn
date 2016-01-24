const promisify = require('./promisify')
const _ = require('lodash');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const pathJoin = require('path').join;
const nodeModule = path => pathJoin(__dirname, '../node_modules', path);
const addArray = (src, key, val) => ((src[key]
  ? src[key].push(val)
  : src[key] = [val]), src);

const getExt = path => path.split(/\.(.+?$)/)[1] || 'js';
const assetGetter = (acc, path) => addArray(acc, getExt(path), readFile(path));

const removeComments = data => data.toString('utf8')
  .replace(/(\/\*(.|\s)*?\*\/\s*)/g, () => '')

const toBase64 = data => data.toString('base64')

const handlers = {
  js: removeComments,
  css: removeComments,
  ico: toBase64,
}

const assets = {};
const saveAsset = ext => val => assets[ext] = val.map(handlers[ext]).join('\n')

module.exports = assetsArray => Promise.all(_(assetsArray).chain()
    .map(nodeModule)
    .reduce(assetGetter, {})
    .map((q, ext) => Promise.all(q).then(saveAsset(ext)))
    .value())
  .then(() => assets)
