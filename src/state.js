const buildState = require('lib/state');
const observ = require('observ');
const router = require('lib/router');
const event = require('lib/event')


const state = {
  split: observ(0.5),
  config: observ({
    login: 'kigiritest',
    password: 'yoloswag137',
  }),
  codeMirror: observ(null),
  exercises: observ({}),
  tests: observ({}),
  sauce: observ({}),
  cookProps: observ({ eye: '_', message: 'Loading...' }),
  messagesCount: observ(0),
  videoId: observ(''),
  videoDisplay: observ('normal'),
  _hotVersion: observ(0),
  viewHeight: event.viewHeight,
  viewWidth: event.viewWidth,
  lbtn: event.lbtn,
}

const globalState = {
  observ: buildState(state, router),
  afterEachRender: (cache => {
    const preInit = fn => cache.push(fn);
    preInit.init = fn => {
      cache.forEach(fn);
      globalState.afterEachRender = fn;
    }
    return preInit;
  })([]),
  afterNextRender: fn =>
    globalState.afterEachRender((_, remove) => remove(fn(_)))
}

module.exports = globalState;
