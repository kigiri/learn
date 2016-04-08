const assign = require('lib/assign')
const remove = require('lib/arr').remove

const TOP_LEFT = 0
const TOP_RIGHT = 1
const BOTTOM_LEFT = 3
const BOTTOM_RIGHT = 2

// on move check if anchor is already taken

const add = (main, anchor) => {
  const child = Section(main, anchor)

  main.children.push(child)

  return child
}

const del = (main, child) => {
  remove(main.children, child)
  if (main.parent && !main.children.length) {
    del(main.parent, main)
  }
}

const move = (parent, child, anchor = TOP_LEFT) => {
  // anchor 
  child.anchor = anchor || TOP_LEFT
  // if (child.parent !== parent) 
  // parent.
}

function Section(parent, anchor) {
  const children = []
  const state = {
    anchor: anchor || TOP_LEFT,
    children,
    parent,
    move: (sec, anchor) => move(sec, state, anchor),
    add: sec => add(state, sec),
    del: sec => del(state, sec),
  }

  return state
}

const s = Section()

s.TL = s.TOP_LEFT = TOP_LEFT
s.TR = s.TOP_RIGHT = TOP_RIGHT
s.BL = s.BOTTOM_LEFT = BOTTOM_LEFT
s.BR = s.BOTTOM_RIGHT = BOTTOM_RIGHT
s.move = move
s.add = add
s.del = del

module.exports = s
