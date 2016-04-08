const emit = require('lib/internal/poly/emit')

module.exports = (setter, emiter, mapper) =>
  emit(setter, emiter, val => setter(mapper(val)))
