const observables = require('state').observ
const defaults = require('lib/defaults')
const inRange = require('lib/arr').inRange
const reduce = require('lib/collection/reduce')
const greet = require('helper/greet')
const each = require('lib/collection/each')
const find = require('lib/find')
const arr = require('lib/arr')

const cookProps = observables.cookProps
const exos = observables.exercises
const conf = observables.config

const defaultDelay = 1000

cookProps(wesh)

const setProps = props => {
  const previousProps = cookProps()
  const newProps = Object.assign({}, previousProps, props)
  if (newProps.eye !== previousProps.eye
    || newProps.message !== previousProps.message) {
    cookProps.set(newProps)
  }
}

const applyProps = reduce((acc, props) => {
  acc.delay += props.delay || defaultDelay

  acc.timeouts.push(setTimeout(() => setProps(props), acc.delay))

  return acc
})

const clearEach = each(clearTimeout)

let playing = false
let timeouts
let messageDurationStack = 0
const clearMessageStack = () => {
  messageDurationStack = 0
  playing = false
  clearEach(timeouts)
}

const animate = props => {
  const state = {
    loop: () => {
      const loop = () => {
        if (state.play === playing) {
          return state.play().then(loop)
        }
      }
      state.play().then(loop)
    },
    play: () => {
      clearMessageStack()
      playing = state.play
      const d = applyProps(props, {
        timeouts: [],
        delay: 0,
      })
      timeouts = d.timeouts
      return new Promise(res => setTimeout(res, d.delay))
    },
    stop: clearMessageStack
  }

  return state
}

const getTotal = (total, duration) => total + duration

const theCookSay = (eye, message, immediate) => {
  if (immediate) {
    clearMessageStack()
    setProps({ eye, message })
  } else {
    timeouts.push(setTimeout(() => {
      if (playing) {
        clearMessageStack()
      } else {
        messageDurationStack -= message.length * 125
      }
      setProps({ eye, message })
    }, messageDurationStack))
  }
  messageDurationStack += message.length * 125
}

const linkedMessages = {
  '000000.js': user => {
    theCookSay('^', 'Well done '+ (conf().name || conf().login), true)
    if (window.localStorage.user) {
      theCookSay('o', 'I will remember you')
      theCookSay('o', 'To be forgotten, delete window.localStorage.user')
    }
    document.getElementById('moulinette').classList.add('loading')
  }
}

animate.load = animate([
  { eye: '.', message: 'waiting on the api -..' },
  { eye: 'o', message: 'waiting on the api -..' },
  { eye: 'O', message: 'waiting on the api .-.' },
  { eye: '@', message: 'waiting on the api ..-' },
  { eye: '*', message: 'waiting on the api .-.' },
])


animate.smile = animate([
  { eye: '^' },
  { eye: 'o' },
])

animate.load.loop()

window.animate = animate
window.say = theCookSay

module.exports = { animate, say: theCookSay }
