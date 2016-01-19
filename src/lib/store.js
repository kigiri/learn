const is = require('./is');

function storeObj(obj, fn, store) {
  const keys = Object.keys(obj);
  const max = keys.length;
  let i = -1, key;

  while (++i < max) { fn(store, obj[keys[i]], keys[i], obj) }

  return store;
}

function storeIter(iter, fn, store) {
  const max = iter.length;
  let i = -1;

  while (++i < max) { fn(store, iter[i], i, iter) }

  return store;
}

module.exports = (collection, fn, store) => {
  if (!collection) return collection
  return (is.int(collection.length) && collection.length > 0)
    ? storeIter(collection, fn, store || {})
    : storeObj(collection, fn, store || {});
}
