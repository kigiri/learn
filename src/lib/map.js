const is = require('lib/is')

function mapObj(obj, fn) {
  const keys = Object.keys(obj);
  const max = keys.length;
  const result = {};
  let i = -1, key;

  while (++i < max) {
    key = keys[i];
    result[key] = fn(obj[key], key, obj);
  }
  return result;
}

function mapIter(iter, fn) {
  const max = iter.length;
  const result = Array(max);
  let i = -1;

  while (++i < max) { result[i] = fn(iter[i], i, iter) }
  return result;
}

function mapObjToArray(obj, fn) {
  const keys = Object.keys(obj);
  const max = keys.length;
  const result = Array(max);
  let i = -1;

  while (++i < max) { result[i] = fn(obj[keys[i]], keys[i], obj) }
  return result;
}

const map = (collection, fn) => {
  if (!collection) return collection
  return (is.int(collection.length) && collection.length > 0)
    ? mapIter(collection, fn)
    : mapObj(collection, fn);
}


map.toArray = (collection, fn) => {
  if (!collection) return collection
  return (is.int(collection.length) && collection.length > 0)
    ? mapIter(collection, fn)
    : mapObjToArray(collection, fn);
}

module.exports = map