const observables = require('state').observ
const inRange = require('lib/arr').inRange
const find = require('lib/find')

const exemples = observables.exemples
const conf = observables.config

let currentIdx = 0
let exerciselist = []

exemples(val => exerciselist = Object.keys(val))

observables.exercise(exercise => window.localStorage.exercise = exercise)

const load = idx => {
  const newIdx = inRange(exerciselist, idx)
  if (newIdx === currentIdx) return
  currentIdx = idx
  observables.exercise.set(exerciseList[currentIdx])
}

module.exports = {
  next: () => load(idx + 1),
  prev: () => load(idx - 1),
}
