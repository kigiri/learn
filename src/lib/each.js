const is = require('lib/is')

function eachObj(obj, fn) {
  const keys = Object.keys(obj);
  const max = keys.length;
  let i = -1;

  while (++i < max) {
    if (fn(obj[keys[i]], keys[i], obj) === false) { return obj }
  }
  return obj;
}

function eachIter(iter, fn) {
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
    ? eachIter(collection, fn)
    : eachObj(collection, fn);
}
