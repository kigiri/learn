const buildTest = require('lib/internal/poly/test')
const emit = require('lib/internal/poly/emit')

function filter(setter, emiter, test) {
  const fn = buildTest(test)

  return emit(setter, emiter, val => fn(val) && setter(val))
}

module.exports = filter
