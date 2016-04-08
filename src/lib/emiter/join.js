const isFn = require('lib/is').fn
const each = require('lib/collection/each')

function join(setter, listeners) {
  const data = {}

  each((listen, key) => {
    (listen.listen || listen)(val => {
      data[key] = val
      setter(data)
    })
    if (isFn(listen.set)) {
      data[key] = listen()
    }
  }, listeners)

  return setter(data)
}

module.exports = join
