const buildState = require('lib/state')
const observ = require('lib/emiter/observ')
const event = require('lib/event')
const assignDeep = require('lib/assign-deep')
const window = require('global/window')
const hash = require('lib/hash')
const defaults = require('data/defaults')

const config = observ({})

config.update = newConf => config.set(assignDeep(config(), newConf))

const exercise = observ.check('')

const updateConf = () => {
  const [ user, repo, branch, ex ] = hash.parts()
  const prevEx = exercise()
  if (prevEx !== ex) {
    if (prevEx) return hash.set(`${user}/${repo}/${branch}/${prevEx}/`)
    exercise.set(ex)
  }

  config.update({
    branch: branch || defaults.branch,
    srcRepo: (user || defaults.user) +'/'+ (repo || defaults.repo),
  })
}

hash(updateConf)

updateConf()

const state = {
  exercise,
  config,
  split: observ.check(0.5),
  codeMirror: observ(null),
  exemples: observ({}),
  progress: observ(''),
  tests: observ({}),
  test: observ(''),
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
