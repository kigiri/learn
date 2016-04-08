const reduce = require('lib/collection/reduce')

module.exports = reduce((acc, fn) => acc.then(fn))
