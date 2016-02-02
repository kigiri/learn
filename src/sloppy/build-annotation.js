var moulinter = require('helper/moulinette-linter')
var observables = require('state').observ
var sauce = observables.sauce
var cookProps = observables.cookProps
var count = require('lib/count')


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


function buildAnnotation(userCode, editorCm, cb, apply) {
  "use strict"
  return function getAnnotation(testCode, opts, testCm) {
    console.log('======================================')
    try {
      eval(userCode)
      cb([])
      console.log('eval userCode::: success')
    } catch (err) {
      console.log('eval userCode::: failed')
      cb(apply(moulinter(err, userCode, 1)))
      return []
    }

    try {
      index = 0
      sauce().success(eval(userCode +'\n'+ testCode +'\n'+ sauce().postData))
      console.log('eval testCode::: success')
    } catch (err2) {
      console.log('eval testCode::: failed')
      return apply(moulinter(err2, testCode, count(userCode, '\n') + 2))
    }
    return apply([])
  }
}

module.exports = buildAnnotation
