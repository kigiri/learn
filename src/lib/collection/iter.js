const isInt = require('lib/is').int

function polyIterate(method, fn, collection, ...args) {
  if (!collection) return collection
  return isInt(collection.length)
    ? method.arr(fn, collection, ...args)
    : method.obj(fn, collection, ...args)
}

const currify = fn => (...args) => (args.length === 1)
  ? fn.bind(null, args[0])
  : fn(...args)

function makePolymorphic(method) {
  const m = (...args) => (args.length === 1)
    ? polyIterate.bind(null, method, args[0])
    : polyIterate(method, ...args)

  m.arr = currify(method.arr)
  m.obj = currify(method.obj)

  return m
}

makePolymorphic.currify = currify

module.exports = makePolymorphic
