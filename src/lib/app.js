const diff = require('virtual-dom/vtree/diff')
const mainLoop = require('lib/main-loop')
const rafLoop = require('lib/loop')
const patch = require('virtual-dom/vdom/patch')
const create = require('virtual-dom/vdom/create-element')
const assign = require('lib/assign')
const Delegator = require('dom-delegator')

// load exercises
require('helper/exercises')


function app(elem, state, render, opts) {
  Delegator(opts)
  const loop = mainLoop(state.observ(), render, assign({
    diff,
    create,
    patch
  }), opts)

  if (elem) {
    elem.appendChild(loop.target)
  }

  state.afterEachRender.init(loop.once)

  return state.observ(loop.update)
}

module.exports = app
