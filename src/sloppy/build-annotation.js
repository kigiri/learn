var moulinter = require('helper/moulinette-linter')
var observables = require('state').observ
var sauce = observables.sauce
var animateTheCook = require('helper/animate-the-cook')
var count = require('lib/count')
var series = require('lib/promise-series')



var index = 0
var validator = bool => valid => {
  index++
  if (valid !== bool) {
    throw new Error('test #'+ index +' failed :(')
  }
}


var loadAnimation = animateTheCook([
  { eye: '.', message: 'waiting for the server-..' },
  { eye: 'o', message: 'waiting for the server-..' },
  { eye: 'O', message: 'waiting for the server.-.' },
  { eye: '@', message: 'waiting for the server..-' },
  { eye: '*', message: 'waiting for the server.-.' },
])

var isTrue = validator(true)
var isFalse = validator(false)

var defaultAnnotation = {
  message: 'failed to compile your code',
  from: { line: 0, ch: 0 },
  to: { line: 1, ch: 0 },
}

function buildAnnotation(userCode, editorCm, editorCb, apply) {
  "use strict"
  const work = [ Promise.resolve() ]

  function server(action, data) {
    const err = Error('unable to reach the server with' + action)
    work.push(() => new Promise((s, f) => {
      setTimeout(() => s(data), 5000)
    }))
  }

  return function getAnnotation(testCode, testCb, opts, testCm) {
    try {
      eval(userCode)
      editorCb([])
      console.log('eval userCode::: success')
    } catch (errUser) {
      console.log('eval userCode::: failed')
      editorCb(apply(moulinter(errUser, userCode, 1)))
      return testCb([])
    }

    function fail(err) {
      console.log('eval testCode::: failed')
      const annotations = moulinter(err, testCode, count(userCode, '\n') + 2)
      testCm.scrollIntoView({
        line: annotations[0].from.line,
        ch: 0,
      }, 15)
      testCb(apply(annotations))
    }

    let evalResult
    try {
      index = 0
      evalResult = eval(userCode +'\n'+ testCode +'\n'+ sauce().postData)
    } catch (errCode) {
      return fail(errCode)
    }

    loadAnimation.loop()
    series(work).then(() => {
      console.log('eval testCode::: success')
      sauce().success(evalResult)
      testCb(apply([]))
    }).catch(fail).then(loadAnimation.stop)
    //
  }
}

module.exports = buildAnnotation
