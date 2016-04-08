const debounce = require('lib/debounce')

module.exports = (setter, emiter, delta, imediate) =>
  emiter(debounce(setter, delta, imediate))
