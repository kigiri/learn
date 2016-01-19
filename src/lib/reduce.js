import { isInt } from './is'

function reduceObj(obj, fn, result) {
  const keys = Object.keys(obj);
  const max = keys.length;
  let i = -1, key;

  if (result === undefined) { result = obj[keys[++i]] }

  while (++i < max) { result = fn(result, obj[keys[i]], keys[i], obj) }

  return result;
}

function reduceIter(iter, fn, result) {
  const max = iter.length;
  let i = -1;

  if (result === undefined) { result = iter[++i] }

  while (++i < max) { result = fn(result, iter[i], i, iter) }

  return result;
}

export default (collection, fn, first) => {
  if (!collection) return collection
  return (isInt(collection.length) && collection.length > 0)
    ? reduceIter(collection, fn, first)
    : reduceObj(collection, fn, first);
}
