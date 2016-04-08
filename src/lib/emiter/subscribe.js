const remove = require('lib/arr').remove

module.exports = (listeners, fn, value) => {
  if (typeof fn !== 'function') return value
  listeners.push(fn)
  return () => listeners && remove(listeners, fn)
}
