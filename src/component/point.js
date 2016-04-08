const remove = require('lib/arr')

function Point(isVertical, parent) {
  const state = {
    parent,
    isVertical,
    children: [],
    del: () => remove(parent, state),
    move: val => state.size = val,
    reset: () => state.size = 0,
  }

  parent && parent.children.push(state)

  return state
}

Point.y = base => Point(true, base)
Point.x = base => Point(false, base)

module.exports = Point

