const iter = require('lib/collection/iter')
const isUndef = require('lib/is').undef

function reduceKeys(fn, collection, acc) {
  const keys = Object.keys(collection)
  const max = keys.length
  let i = -1, key

  if (isUndef(acc)) {
    acc = collection[keys[++i]]
  }

  while (++i < max) {
    key = keys[i]
    acc = fn(acc, collection[key], key, collection)
  }
  return acc
}

function reduceIndex(fn, collection, acc) {
  const max = collection.length
  let i = -1

  if (isUndef(acc)) {
    acc = collection[++i]
  }

  while (++i < max) { acc = fn(acc, collection[i], i, collection) }
  return acc
}

const reduce = iter({
  arr: reduceIndex,
  obj: reduceKeys,
})

module.exports = reduce
