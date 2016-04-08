const iter = require('lib/collection/iter')

function eachObj(fn, obj) {
  const keys = Object.keys(obj)
  const max = keys.length
  let i = -1

  while (++i < max) {
    if (fn(obj[keys[i]], keys[i], obj) === false) { return obj }
  }
  return obj
}

function eachIter(fn, iter) {
  const max = iter.length
  let i = -1

  while (++i < max) {
    if (fn(iter[i], i, iter) === false) { return iter }
  }
  return iter
}

module.exports = iter({
  obj: eachObj,
  arr: eachIter,
})
