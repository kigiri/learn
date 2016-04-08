const methods = require('lib/emiter/methods')

const notAFunction = () => Error('Uncaught TypeError: executor is not a function')

function Stream(executor) {
  if (!isFn(executor)) throw notAFunction()
  const start = (fn, key) => {
    const obs = Observ()
    const end = Observ.once()
    const error = Observ()
    let firstListenerDispose

    const decorate = d => {
      d.sub = fn => decorate(obs(fn))
      d.end = fn => decorate(end(fn))
      d.error = fn => decorate(error(fn))
      d.dispose = dispose
      return d
    }

    if (key === 'end') firstListenerDispose = end(fn)
    else if (key === 'error') firstListenerDispose = error(fn)
    else firstListenerDispose = obs(fn)

    obs.set.error = error.set
    obs.set.end = obs.dispose = val => { // do dispose need a value ?
      if (end.set) end.set(val)
      if (dispose) dispose(val)
      return val
    }

    const dispose = executor(obs.set)

    return decorate(firstListenerDispose)
  }

  const trigger = () => {}

  trigger.sub = fn => start(fn)
  trigger.end = fn => start(fn, 'end')
  trigger.error = fn => start(fn, 'error')

  return trigger
}

const buildMethod = fn => (...args) => Stream(setter => fn(setter, ...args))

each((fn, key) => Stream[key] = buildMethod(fn), methods)

module.exports = Stream
