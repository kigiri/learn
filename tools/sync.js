const config = require('./config')
const ftps = require('ftps-promise')(config.ssh);
const _ = require('lodash');
const fs = require('fs');
const readdir = p => new Promise((s,j) => fs.readdir(p, (e,r) => e?j(e):s(r)));
const pathJoin = require('path').join;
const srcPath = pathJoin(__dirname, '../public');
const distPath = _.partial(pathJoin, config.syncPath);
const localPath = _.partial(pathJoin, 'public');

const syncFile = fileName => ftps
  .cd(config.syncPath)
  .put(localPath(fileName), './'+ fileName)
  .then(err => console.log(localPath(fileName), '->', distPath(fileName)))

module.exports = () => readdir(srcPath)
  .then(files => Promise.all(_.map(files, syncFile)))
  .then(() => ftps.cd(config.syncPath).ls())
  .then((ret) => console.log(ret.data))
  .catch(console.log)

