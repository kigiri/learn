const loop = require('lib/loop');
const ev = require('geval/event');
const once = require('lib/once');
const window = require('global/window');

const errorMessage = 'main-loop: Unexpected update occurred in loop.\n'
  +'We are currently rendering a view, you can\'t change state right now.\n'
  +'SUGGESTED FIX: find the state mutation in your view '
  +'or rendering function and remove it.\n'
  +'The view should not have any side effects.\n'
  +'This may also have happened if rendering did not complete due to an error.'

module.exports = function mainLoop(initialState, view, opts) {
  opts = opts || {}

  const create = opts.create
  const diff = opts.diff
  const patch = opts.patch
  const mLoop = ev();

  let redrawScheduled = false
  let currentState = initialState
  let tree = opts.initialTree || view(currentState)
  let target = opts.target || create(tree, opts)
  let inRenderingTransaction = false

  const requestRedraw = once(loop.after, () => {
    redrawScheduled = false
    if (currentState === null) return

    inRenderingTransaction = true
    const newTree = view(currentState)

    if (opts.createOnly) {
      inRenderingTransaction = false
      create(newTree, opts)
    } else {
      inRenderingTransaction = false
      target = patch(target, diff(tree, newTree, opts), opts)
    }

    tree = newTree
    mLoop.broadcast(currentState);
    currentState = null
  });

  mLoop.once = fn => once(mLoop.listen, fn)();
  mLoop.target = target;
  mLoop.state = initialState;
  mLoop.update = state => {
    if (inRenderingTransaction) {
      console.warn(state._diff)
      throw new Error(errorMessage);
    }

    if (currentState === null && !redrawScheduled) {
      redrawScheduled = true
      requestRedraw()
    }

    currentState = state
    if (window) {
      window._state = state;
    }
    mLoop.state = state
  }

  currentState = null

  return mLoop
}