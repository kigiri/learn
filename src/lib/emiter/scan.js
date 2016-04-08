const emit = require('lib/internal/poly/emit')

module.exports = (setter, emiter, reducer, acc) => {
  let set = (acc !== undefined)

  if (!set && emiter.set) {
    acc = emiter()
  }

  const accumulate = val => acc = reducer(acc, val)
  emit(setter, emiter, val => {
    if (set) return accumulate(val)
    set = true
    acc = val
    return val
  })
}
