const methods = require('lib/emiter/methods')
const each = require('lib/collection/each')
const sub = require('lib/emiter/subscribe')

function Observ(value) {
  const listeners = []
  const subscriber = fn => sub(listeners, fn, value)

  subscriber.set = val => {
    value = val
    each(fn => fn(val), listeners)
    return val
  }

  return subscriber
}

const defaultCheck = (a, b) => a !== b
function ObservCheck(value, check) {
  const listeners = []
  check || (check = defaultCheck)
  const subscriber = fn => sub(listeners, fn, value)

  subscriber.set = val => {
    if (!check(val, value)) return
    value = val
    each(fn => fn(val), listeners)
    return val
  }

  subscriber.setCheck = newCheck => check = newCheck

  return subscriber
}

function ObservOnce() {
  let listeners = []
  const subscriber = fn => sub(listeners, fn)

  subscriber.set = val => {
    if (!listeners) return console.warn('trigger a once multiple times')
    each(fn => fn(val), listeners)
    listeners = subscriber.set = null
  }

  return subscriber
}

function ObservFormat(src, format) {
  const set = src.set
  src.set = val => set(format(val))
  return src
}

function ObservImmediate(src, fn) {
  src(fn)
  fn(src())
  return src
}

Observ.format = ObservFormat
Observ.check = ObservCheck
Observ.once = ObservOnce
Observ.immediate = ObservImmediate

const buildMethod = method => (...args) => {
  const obs = Observ()

  method(obs.set, ...args)

  return obs
}

each((fn, key) => Observ[key] = buildMethod(fn), methods);

module.exports = Observ
