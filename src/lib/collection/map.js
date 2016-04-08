const iter = require('lib/collection/iter')

function mapToArr(fn, collection) {
  const keys = Object.keys(collection)
  const max = keys.length
  const result = Array(max)
  let i = -1, key

  while (++i < max) {
    key = keys[i]
    result[i] = fn(collection[key], key, collection)
  }
  return result
}

function mapKeys(fn, collection) {
  const keys = Object.keys(collection)
  const max = keys.length
  const result = {}
  let i = -1, key

  while (++i < max) {
    key = keys[i]
    result[key] = fn(collection[key], key, collection)
  }
  return result
}

function mapIndex(fn, collection) {
  const max = collection.length
  const result = Array(max)
  let i = -1

  while (++i < max) { result[i] = fn(collection[i], i, collection) }
  return result
}

const map = iter({
  arr: mapIndex,
  obj: mapKeys,
})

map.toArr = iter.currify(mapToArr)

module.exports = map
