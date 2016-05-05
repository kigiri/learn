const moulinter = require('helper/moulinette-linter')
const observables = require('state').observ
const sauce = observables.sauce
const animateTheCook = require('helper/animate-the-cook')
const count = require('lib/count')
const series = require('lib/promise-series')
const is = require('lib/is')

let index = 0
const validator = bool => valid => {
  index++
  if (valid !== bool) {
    throw new Error('test #'+ index +' failed :(')
  }
}

const loadAnimation = animateTheCook([
  { eye: '.', message: 'waiting for the server-..' },
  { eye: 'o', message: 'waiting for the server-..' },
  { eye: 'O', message: 'waiting for the server.-.' },
  { eye: '@', message: 'waiting for the server..-' },
  { eye: '*', message: 'waiting for the server.-.' },
])

const isTrue = validator(true)
const isFalse = validator(false)

const defaultAnnotation = {
  message: 'failed to compile your code',
  from: { line: 0, ch: 0 },
  to: { line: 1, ch: 0 },
}

const separator = '\n__inUserCode__ = false;'

function buildAnnotation(userCode, editorCm, editorCb, apply) {
  "use strict"
  const work = [ Promise.resolve() ]
  let __inUserCode__ = true

  function server(action, data) {
    if (__inUserCode__) {
      throw new Error('You are not allowed to call the server directly')
    }
    const err = new Error()
    console.log(action, data)
    work.push(() => (new Promise((s, f) => {
      setTimeout(() => s(data), 5000)
    }).catch(e => {
      err.message = e.message
      throw e
    })))
  }

  server.user = { check: () => {} }

  const store = (s => ({
    get: key => {
      const value = s.get(key)
      return is.obj(value) ? Object.assign({}, value) : undefined
    },
    set: (key, value) => {
      if (__inUserCode__) {
        throw new Error('You have readonly access to the store')
      }
      s.set(key, value)
      return store
    }
  }))(new Map())

  return function getAnnotation(testCode, testCb, opts, testCm) {
    try {
      __inUserCode__ = true
      // TODO : test if the usercode contains __inUserCode__ anywhere
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
      evalResult = eval(userCode + separator + testCode +'\n'+ sauce().postData)
    } catch (errCode) {
      return fail(errCode)
    }

    loadAnimation.loop()
    series(work).then(() => {
      console.log('eval testCode::: success')
      sauce().success(evalResult)
      testCb(apply([]))
    }).catch(fail)
      .then(() => {
        loadAnimation.stop()
        const match = testCode.split('// next test : ')[1]
        console.log('next:', match.trim())
      })
  }
}

module.exports = buildAnnotation
