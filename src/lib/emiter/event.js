const methods = require('lib/emiter/methods')
const each = require('lib/collection/each')
const sub = require('lib/emiter/subscribe')

function Event() {
  const listeners = []
  return {
    listen: fn => sub(listeners, fn),
    broadcast: val => { each(fn => fn(val), listeners) },
  }
}

const buildMethod = method => (...args) => {
  const ev = Event()

  method(ev.broadcast, ...args)

  return ev
}

each((fn, key) => Event[key] = buildMethod(fn), methods);

