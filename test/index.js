const test = require('tape')
const join = require('path').join
const base = join(__dirname, '../src')
const modulePath = require('app-module-path')

// FFFfffff--- phantomJS.
if (!Function.prototype.bind) {
  /*eslint no-extend-native: 0*/
  Function.prototype.bind = require('function-bind')
}

modulePath.addPath(base)

;[
  'equal',
  'notEqual',
].forEach(key => test[key] = msg => (...args) => test(msg, assert => {
  assert[key](...args)
  assert.end()
}))

;[
  'lib/assign-deep',
  'lib/h',
].forEach(path => require('./'+ path)(test, require(join(base, path))))
