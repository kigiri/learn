const buildState = require('lib/state')
const observ = require('lib/emiter/observ')
const event = require('lib/event')
const assignDeep = require('lib/assign-deep')
const window = require('global/window')
const hash = require('lib/hash')
const defaults = require('data/defaults')
const local = window.localStorage
const config = observ({})
const progress = observ('')

config.update = newConf => config.set(assignDeep(config(), newConf))

const exercise = observ.check(local.exercise)

observ.immediate(exercise, ex => {
  local.exercise = ex
  progress.set(local[ex])
})

const setUrlDefault = (user, repo, branch, ex) => hash.set(
  `${ user || defaults.user
  }/${ repo || defaults.repo
  }/${ branch || defaults.branch }/${ex}/`)

observ.immediate(hash, () => {
  const [ user, repo, branch, ex ] = hash.parts()
  const prevEx = exercise()
  if (!ex) {
    if (prevEx) return setUrlDefault(user, repo, branch, prevEx)
  } else if (prevEx !== ex) {
    if (prevEx) return setUrlDefault(user, repo, branch, prevEx)
    exercise.set(ex)
  }

  config.update({
    branch: branch || defaults.branch,
    srcRepo: (user || defaults.user) +'/'+ (repo || defaults.repo),
  })
})

window.reloadDebug = (val) => val && test.set(val)
const test = observ('')

const state = {
  test,
  config,
  exercise,
  progress,
  split: observ.check(0.5),
  codeMirror: observ(null),
  exemples: observ({}),
  tests: observ({}),
  cookProps: observ({ eye: '-', message: 'Loading .....' }),
  _hotVersion: observ(0),
  viewHeight: event.viewHeight,
  viewWidth: event.viewWidth,
  lbtn: event.lbtn,
}

window.__state__ = state

const globalState = {
  observ: buildState(state),
  afterEachRender: (cache => {
    const preInit = fn => cache.push(fn)
    preInit.init = fn => {
      cache.forEach(fn);
      globalState.afterEachRender = fn
    }
    return preInit
  })([]),
  afterNextRender: fn =>
    globalState.afterEachRender((_, remove) => remove(fn(_)))
}

module.exports = globalState;
