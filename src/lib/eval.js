const worker = require('lib/worker')
const Ev = require('lib/emiter/event')
const messageEvent = Ev()

const evalWorker = worker(`
"use strict"

let __index__ = 0
const validator = bool => valid => {
  __index__++
  if (valid !== bool) {
    throw new Error('test #'+ __index__ +' failed :(')
  }
}

const isTrue = validator(true)
const isFalse = validator(false)

let __instructionsCount__
const _$_ = () => { // limit instruction injected counter
  if (++__instructionsCount__ > 10000) {
    throw new Error('Reached max iteration count')
  }
}

onmessage = function (e) {
  __instructionsCount__ = 0
  __index__ = 0
  try {
    eval(e.data)
    postMessage(0)
  } catch (err) {
    postMessage({
      message: err.message,
      stack: err.stack,
    })
  }
}`)

evalWorker.onmessage = messageEvent.broadcast

let _parsingStartTime = 0
const timeoutError = msg => {
  const err = Error(msg)
  err.startTime = _parsingStartTime
  return err
}

const asyncEval = code => new Promise((s, f) => {
  if (_parsingStartTime) return f(timeoutError('Already waiting for an answer'))
  _parsingStartTime = Date.now()
  evalWorker.postMessage(code)
  let _timeout = setTimeout(() => f(timeoutError('Worker not responding')), 5000)
  const clear = messageEvent.listen(e => {
    _parsingStartTime = 0
    clearTimeout(_timeout)
    clear()
    s(e.data)
  })
})

module.exports = asyncEval
