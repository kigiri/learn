const cookProps = require('state').observ.cookProps
const defaults = require('lib/defaults')
const each = require('lib/collection/each')
const reduce = require('lib/collection/reduce')

const defaultDelay = 1000

const setProps = props => cookProps.set(wesh(defaults(props), cookProps()))

const applyProps = reduce((acc, props) => {
  acc.delay += props.delay || defaultDelay


  console.log(acc)
  acc.timeouts.push(setTimeout(() => setProps(props), acc.delay))

  return acc
})

const clearEach = each(clearTimeout)

module.exports = props => {
  let timeouts
  let playing = false

  const state = {
    loop: () => {
      const loop = () => {
        if (playing) {
          return state.play().then(loop)
        }
      }
      state.play().then(loop)
    },
    play: () => {
      playing = true
      const d = applyProps(props, {
        timeouts: [],
        delay: 0,
      })
      timeouts = d.timeouts
      return new Promise(res => setTimeout(res, d.delay))
    },
    stop: finalProps => {
      playing = false
      clearEach(timeouts)
    }
  }

  return state
}


