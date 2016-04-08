const isFn = require('lib/is').fn

function pausable(setter, controller, listener) {
  let on

  if (isFn(controller.set)) {
    on = controller()
  }

  listener(val => on && setter(val))
  controller(val => on = val)
}

module.exports = pausable
