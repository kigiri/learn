const buildState = require('lib/state');
const observ = require('observ');
const router = require('lib/router');
const event = require('lib/event')

function incrementCount(state) {}

const globalState = {
  observ: buildState({
    split: observ(0.5),
    videoId: observ(''),
    _hotVersion: observ(0),
    viewHeight: event.viewHeight,
    viewWidth: event.viewWidth,
    lbtn: event.lbtn,
    channels: {
      clicks: incrementCount
    }
  }, router),
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