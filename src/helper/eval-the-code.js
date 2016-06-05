const observables = require('state').observ
const moulinter = require('helper/moulinette-linter')
const asyncEval = require('lib/eval')
const exercises = require('helper/exercises')
const theCook = require('component/the-cook')
const reduce = require('lib/collection/reduce')
const series = require('lib/promise-series')
const count = require('lib/count')
const map = require('lib/collection/map')
const api = require('helper/github')
const is = require('lib/is')

const maxTest = observables.maxTest
const exercise = observables.exercise
const editorMode = observables.editorMode
const maxExercise = observables.maxExercise

const baseAnnotation = {
  from: { line: 0, ch: 0  },
  to:   { line: 0, ch: 10 },
}

const fromMsg = message => [ Object.assign({ message }, baseAnnotation) ]

let _timeout
let _currentWork = Promise.resolve()
const requestUpdate = args => _currentWork.then(() => {
  if (_timeout) {
    clearTimeout(_timeout)
    return _timeout = setTimeout(() => _currentWork = getAnnotation(args), 250)
  }
  _currentWork = getAnnotation(args)
  _timeout = setTimeout(() => {}, 250)
})

const toLine = a => a.from.line
const getMax = (a, b) => a > b ? a : b

const autoNext = () => {
  if (exercise() !== maxExercise()) {
    maxExercise.set(exercise())
    exercises.next()
  }
}

function getAnnotation({ testCm, testCb, testCode, editorCb, userCode }) {
  if (exercise()) {
    window.localStorage[exercise()] = userCode
  }

  const handleFinalEvalReturn = err => {
    if (!err) {
      theCook.animate.load.stop()
      theCook.animate.smile.play()
        .then(() => theCook.say('^', 'Next !', true))
        .then(autoNext)
      return { test: [] }
    }
    const annotations = moulinter(err, testCode, count(userCode, '\n') + 2)
    if (err.test && err.test > maxTest()) {
      api.update.progress('autosave')
      maxTest.set(err.test)
      testCm.scrollIntoView({
        line: annotations.test.map(toLine).reduce(getMax, 0),
        ch: 0
      }, 15)
    }
    return annotations
  }

  const handleTimeoutErrors = err => {
    if (!err.startTime) return { test: fromMsg(err.message) }
    const diff = Date.now() - err.startTime

    if (diff < 10000) return { test: fromMsg(err.message) }

    return {
      test: fromMsg(`The eval worker has been blocked for ${diff}ms,`
        +' check your code for infinit loops'
        +' and reload the page once you fixed it')
    }
  }

  const finalize = ({ editor, test }) => {
    theCook.animate.load.stop()
    const forTheCook = (test ? test : editor)
    if (forTheCook && forTheCook.length) {
      console.log(forTheCook, forTheCook[forTheCook.length - 1].message)
      theCook.say('x', forTheCook[forTheCook.length - 1].message, true)
    }
    editorCb(editor || [])
    testCb(test || [])
  }

  theCook.animate.load.loop()
  return asyncEval(userCode).then(err => err
    ? moulinter(err, userCode, 1)
    : asyncEval(userCode +'\n'+ testCode)
      .then(handleFinalEvalReturn))
    .catch(handleTimeoutErrors)
    .then(finalize)
}

const buildAnnotation = ({ cb, text }) =>
  (testCode, testCb, opts, testCm) => requestUpdate({
    testCm,
    testCb,
    testCode,
    editorCb: cb,
    userCode: text,
  })

module.exports = buildAnnotation
