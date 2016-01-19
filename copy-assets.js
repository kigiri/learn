function promisify(f){
  return function () {
    var a = Array.prototype.slice.call(arguments);

    return new Promise((s, j) =>
      f.apply(this, a.concat((err, val) => err ? j(err) : s(val))))
  }
}

const _ = require('lodash');
const fs = require('fs');
const pathJoin = require('path').join;
const join = _.partial(pathJoin, __dirname);
const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const ensure = require('./ensure');
const assets = require('./assets');

function copy(sourcePath, targetPath) {
  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(sourcePath);
    const ws = fs.createWriteStream(targetPath);

    rs.on('error', reject);
    ws.on('error', reject);
    ws.on('close', resolve);
    rs.pipe(ws);
  })
}

function copyFiles(libs, type) {
  return _.map(libs, (path, module) => {
    const sourcePath = join(path +'.'+ type);
    const targetPath = join('public', type, module +'.'+ type);
    return copy(sourcePath, targetPath)
      .then(() => console.log('file copied:', targetPath))
      .catch(err => console.error('failed to copy', targetPath
        +'\n'+ err.message));
  })
}

const skipAlreadyExists = err => {
  if (err.code !== 'EEXIST') {
    throw err;
  }
};

Promise.all(_.map(assets, (files, type) => ensure(join('public', type))
    .then(copyFiles(files, type))))
  .then(() => console.log('All done.'))
  .catch(err => console.log(err))
