const is = require('lib/is')

module.exports = (arr, value) => is.arr(arr)
  ? (arr.push(value), arr)
  : [value]
