const is = require('lib/is')
const reduce = require('lib/reduce')

const count = (collection, fn) => 
  reduce(collection, (t, e, i, c) => t + Boolean(fn(e, i, c)), 0)

module.exports = (collection, opts) => {
  if (is.fn(opts)) return count(collection, opts)
  if (is.fn(opts.test)) return count(collection, str => opts.test(str))
  return count(collection, str => str === opts)
}
