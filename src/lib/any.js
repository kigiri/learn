const is = require('lib/is')

function anyObj(obj, fn) {
  const keys = Object.keys(obj);
  const max = keys.length;
  let i = -1;

  while (++i < max) {
    if (fn(obj[keys[i]], keys[i], obj) === false) { return obj }
  }
  return obj;
}

function anyIter(iter, fn) {
  const max = iter.length;
  let i = -1;

  while (++i < max) {
    if (fn(iter[i], i, iter) === false) { return iter }
  }
  return iter;
}

module.exports = (collection, fn) => {
  if (!collection) return collection
  return (is.int(collection.length) && collection.length > 0)
    ? anyIter(collection, fn)
    : anyObj(collection, fn);
}
