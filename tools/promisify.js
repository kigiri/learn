const _ = require('lodash');

function promisify(f) {
  const self = this;
  return function () {
    const a = Array.prototype.slice.call(arguments);
    return new Promise((s, j) =>
      f.apply(self, a.concat((err, val) => err ? j(err) : s(val))))
  }
}

function promisifyAll(obj, deep) {
  return deep < 3 ? _.each(obj, (method, name) => {
    if (_.isFunction(method)) {
      obj[name] = promisify.call(obj, method);
    } else if (_.isObject(method)) {
      promisifyAll(method, deep + 1);
    }
  }) : obj;
}

promisify.all = obj => promisifyAll(obj, 0);

module.exports = promisify;
