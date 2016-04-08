const each = require('lib/collection/each')
const methods = require('lib/emiter/methods')
const sub = require('lib/emiter/subscribe')

function Observ(value) {
  const listeners = []
  const subscriber = fn => sub(listeners, fn, value)

  subscriber.set = val => {
    each(fn => fn(val), listeners)
    value = val
  }

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

Observ.once = ObservOnce

const buildMethod = method => (...args) => {
  const obs = Observ()

  method(obs.set, ...args)

  return obs
}

each((fn, key) => Observ[key] = buildMethod(fn), methods);

module.exports = Observ
