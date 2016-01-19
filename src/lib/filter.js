import is from './is'

function filterObj(obj, fn) {
  const keys = Object.keys(obj);
  const max = keys.length;
  const result = {};
  let i = -1, key;

  while (++i < max) {
    key = keys[i];
    if (fn(obj[key], key, obj)) {
      result[key] = obj[key];
    }
  }
  return result;
}

function filterIter(iter, fn) {
  const max = iter.length;
  const result = [];
  let i = -1;

  while (++i < max) {
    if (fn(iter[i], i, iter)) {
      result.push(iter[i]);
    }
  }
  return is.string(iter) ? result.join('') : result;
}

export default (collection, fn) => {
  if (!collection) return collection
  return (is.int(collection.length) && collection.length > 0)
    ? filterIter(collection, fn)
    : filterObj(collection, fn);
}