const each = require('lib/each')
const is = require('lib/is')

const find = (arr, fn) => {
  let match
  each(arr, str => {
    if (fn(str)) {
      match = str
      return false
    }
  })
  return match
}

module.exports = (arr, opts) => {
  if (is.fn(opts)) return find(arr, opts)
  if (is.str(opts)) return find(arr, str => str.indexOf(opts) > -1)
  if (is.fn(opts.test)) return find(arr, str => opts.test(str))
  return find(arr, str => str === opts)
}
