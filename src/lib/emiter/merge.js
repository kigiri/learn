const each = require('lib/each')

module.exports = (setter, listenners) =>
  each((listen, key) => (listen.listen || listen)(setter), listeners)
