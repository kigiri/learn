const observ = require('observ')
const each = require('lib/each')
const is = require('lib/is')

const arrProto = Array.prototype

if (!is.fn(Array.from)) {
  throw new Error('need polyfill for Array.from')
}

const accessors = [
  'includes',
  'indexOf',
  'lastIndexOf',
  'toLocaleString',
  'toSource',
  'toString',
]

const pure = [
  'concat',
  'filter',
  'join',
  'map',
  'reduce',
  'slice',
]

const mutators = [
  'pop',
  'push',
  'reverse',
  'shift',
  'sort',
  'splice',
  'unshift',
]

module.exports = list => {
  is.arr(list) || (list = Array.from(list))
  const obs = observ(list)

  each(accessors, key => {
    const fn = arrProto[key]
    obs[key] = function () {
      return fn.apply(list, arguments)
    }
  })

  each(mutators, key => {
    const fn = arrProto[key]
    obs[key] = function () {
      fn.apply(list, arguments)
      return obs.set(list)
    }
  })

  each(pure, key => {
    const fn = arrProto[key]
    obs[key] = function () {
      return obs.set(list = fn.apply(list, arguments))
    }
  })

  return obs
}