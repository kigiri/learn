const observables = require('state').observ
const inRange = require('lib/arr').inRange
const find = require('lib/find')

const exemples = observables.exemples
const conf = observables.config

let currentIdx = 0
let saucelist = []

exemples(val => saucelist = Object.keys(val))

observables.sauce(sauce => window.localStorage.sauce = sauce)

const load = idx => {
  const newIdx = inRange(saucelist, idx)
  if (newIdx === currentIdx) return
  currentIdx = idx
  observables.sauce.set(saucelist[currentIdx])
}

module.exports = {
  next: () => load(idx + 1),
  prev: () => load(idx - 1),
}
