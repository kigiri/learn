const isFn = require('lib/is').fn

module.exports = function makeTest(test) {
  console.log('got', test, test.constructor)
  if (isFn(test)) return test
  if (test.constructor === RegExp) return val => test.test(val)
  if (test && isFn(test.test)) return test.test
  return val => test === val
}
