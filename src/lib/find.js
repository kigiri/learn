const each = require('lib/collection/each')
const buildTest = require('lib/internal/poly/test')
const is = require('lib/is')

const find = (fn, arr) => {
  let match
  each(str => {
    if (fn(str)) {
      match = str
      return false
    }
  }, arr)
  return match
}

const superBuildTest = (test, arr) => is.str(test)
  ? str => str.indexOf(test) > -1
  : buildTest(test)

module.exports = (...args) => (args.length === 1)
  ? find.bind(null, superBuildTest(args[0]))
  : find(superBuildTest(args[0], args[1]))
