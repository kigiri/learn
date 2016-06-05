const observables = require('state').observ
const moulinter = require('helper/moulinette-linter')
const asyncEval = require('lib/eval')
const { next } = require('helper/exercises')
const theCook = require('component/the-cook')
const reduce = require('lib/collection/reduce')
const series = require('lib/promise-series')
const count = require('lib/count')
const map = require('lib/collection/map')
const api = require('helper/github')
const is = require('lib/is')

const exercise = observables.exercise
const editorMode = observables.editorMode

const baseAnnotation = {
  from: { line: 0, ch: 0  },
  to:   { line: 0, ch: 10 },
}

const fromMsg = (apply, message) =>
  apply([ Object.assign({ message }, baseAnnotation) ])

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

function getAnnotation({ apply, testCm, testCb, testCode, editorCb, userCode }) {
  if (exercise()) {
    window.localStorage[exercise()] = userCode
  }

  const handleFinalEvalReturn = err => {
    if (!err) {
      theCook.say('Next !', true).then(next)
      return { test: apply([]) }
    }
    if (err.test && err.test > maxTest()) {
      api.update.progress('autosave')
      maxTest.set(err.test)
    }
    const annotations = moulinter(err, testCode, count(userCode, '\n') + 2)
    if (!editorMode()) {
      testCm.scrollIntoView({ line: annotations[0].from.line, ch: 0 }, 15)
    }
    return { test: apply(annotations) }
  }

  const handleTimeoutErrors = err => {
    console.log(err)
    if (!err.startTime) return { test: fromMsg(apply, err.message) }
    const diff = Date.now() - err.startTime

    if (diff < 10000) return { test: fromMsg(apply, err.message) }

    return {
      test: fromMsg(apply, `The eval worker has been blocked for ${diff}ms,`
        +' check your code for infinit loops'
        +' and reload the page once you fixed it')
    }
  }

  const finalize = ({ editor, test }) => {
    theCook.animate.load.stop()
    editorCb(editor || [])
    testCb(test || [])
  }

  theCook.animate.load.loop()
  return asyncEval(userCode).then(err => err
    ? { editor: apply(moulinter(err, userCode, 1)) }
    : asyncEval(userCode +'\n'+ testCode)
      .then(handleFinalEvalReturn))
    .catch(handleTimeoutErrors)
    .then(finalize)
}

const buildAnnotation = ({ cb, text }, apply) =>
  (testCode, testCb, opts, testCm) => requestUpdate({
    apply,
    testCm,
    testCb,
    testCode,
    editorCb: cb,
    userCode: text,
  })

module.exports = buildAnnotation
