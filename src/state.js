const buildState = require('lib/state')
const observ = require('observ')
const router = require('lib/router')
const event = require('lib/event')
const initialTest = require('sauce/00-basics-00-login.test')
const firstTestName = '00-basics-00-login'
if (!window.localStorage[firstTestName]) {
  window.localStorage[firstTestName] = require('sauce/00-basics-00-login.xmpl')
}

const state = {
  split: observ(0.5),
  config: observ({}),
  codeMirror: observ(null),
  exercises: observ({}),
  tests: observ({}),
  test: observ(initialTest),
  sauce: observ(firstTestName),
  cookProps: observ({ eye: '_', message: 'Loading...' }),
  messagesCount: observ(0),
  _hotVersion: observ(0),
  viewHeight: event.viewHeight,
  viewWidth: event.viewWidth,
  lbtn: event.lbtn,
}

const globalState = {
  observ: buildState(state, router),
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
