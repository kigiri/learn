const worker = require('lib/worker')
const Ev = require('lib/emiter/event')
const messageEvent = Ev()

const evalWorker = worker(`
"use strict"

const validator = bool => valid => {
  index++
  if (valid !== bool) {
    throw new Error('test #'+ index +' failed :(')
  }
}

const isTrue = validator(true)
const isFalse = validator(false)

let _instructionsCount
const _$_ = () => { // limit instruction injected counter
  if (++_instructionsCount > 10000) {
    throw new Error('Reached max iteration count')
  }
}

onmessage = function (e) {
  _instructionsCount = 0
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
