var count = require('lib/count')
var moulinter = require('helper/moulinette-linter')
var ev = require('geval/event')

var success = ev()

var index = 0
var validator = bool => valid => {
  index++
  if (valid !== bool) {
    throw new Error('test #'+ index +' failed :(')
  }
}

var isTrue = validator(true)
var isFalse = validator(false)

var defaultAnnotation = {
  message: 'failed to compile your code',
  from: { line: 0, ch: 0 },
  to: { line: 1, ch: 0 },
}

const sauce = require('data/sauce')

function buildAnnotation(userCode, editorCm, cb, apply) {
  "use strict"
  return function getAnnotation(testCode, opts, testCm) {
    try {
      (function () { eval(userCode) })()
      cb([])
    } catch (err) {      
      cb(apply(moulinter(err, userCode, 1)))
      return [ defaultAnnotation ]
    }

    try {
      index = 0
      success.broadcast(eval(userCode +'\n'+ testCode +'\n'+ sauce[0].postData))
    } catch (err2) {
      return apply(moulinter(err2, testCode, count(userCode, '\n') + 2))
    }
    return apply([])
  }
}

buildAnnotation.success = success.listen

module.exports = buildAnnotation
