const buildState = require('lib/state')
const observ = require('lib/emiter/observ')
const event = require('lib/event')
const assignDeep = require('lib/assign-deep')
const window = require('global/window')
const hash = require('lib/hash')

const config = observ({})

config.update = newConf => config.set(assignDeep(config(), newConf))

const updateConf = () => {
  const [ user, repo, branch ] = hash.parts()
  config.update({
    branch: branch || 'basic',
    srcRepo: (user || 'kigiri') +'/'+ (repo || 'learn'),
  })
}

hash(updateConf)

updateConf()

const state = {
  config,
  split: observ.check(0.5),
  codeMirror: observ(null),
  exercises: observ({}),
  tests: observ({}),
  test: observ(''),
  sauce: observ.check(''),
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
