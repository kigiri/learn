// mouseX
// mouseY
const h = require('lib/h')
const domEv = require('lib/event')
const observ = require('lib/emiter/observ')
const mouse = observ.join({ x: domEv.mouseX, y: domEv.mouseY })
const drag = observ.pausable(domEv.lbtn, mouse)
const map = require('lib/collection/map')

// drag(wesh)

const remove = require('lib/arr')

const wrapper = h.curry('.tab-wrap').style

const content = h.curry('.tab')

const main = () => {}
main.children = []
main.del = () => {}
main.style = {}

main.build = state => (function recur(tab) {
  const t = tab(state)

  if (tab.children.length) {
    return wrapper(tab.style, [ t ].concat(map(recur, tab.children)))
  }
  if (tab.parent) return t
  return wrapper(tab.style, t)
})(main)


function Tab(direction, render, parent) {
  const tab = state => content(tab.style, render(state))

  tab.parent = parent || main
  tab.children = []
  tab.del = () => remove(tab.parent, tab)
  tab.style = { flexDirection: direction, flex: 1 }
  tab.parent.children.push(tab)

  return tab
}

main.y = (render, parent) => Tab('column', render, parent)
main.x = (render, parent) => Tab('row', render, parent)

module.exports = main



