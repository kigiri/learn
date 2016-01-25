const is = require('lib/is')

module.exports = (arr, value) => is.arr(arr)
  ? (arr.unshift(value), arr)
  : [value]
