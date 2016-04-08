
const isFn = require('lib/is').fn
// const each = require('lib/each')
const Observ = require('lib/emiter/observ')

// streams:
//   lazy (cold / hot)
//   terminated
//   disposable

// const doStuff = Stream.compose(a('value'), b, c)

// doStuff(myStream)

const Point = require('component/point')
// require('component/tab')

// compose(a, b, c, d)(value)
const noOp = () => {}

// Stream.catch = function streamCatch(...streams) {
//   let idx = 0
//   const load = () => streams[idx++]
//   const trigger = Stream(obs => {
//     const next = s => {
//       if (!s) return obs.end()
//       const cancelEnd = s.end(obs.end)
//       s.error(err => {
//         cancelEnd()
//         s.dispose(err)
//         obs.error(err)
//         next(load(obs))
//       })
//     }
//     next(load(obs))
//   })
//   return trigger
// }

// // test
// window.b = Stream(obs => {
//   const timeouts = []
//   for (var i = 1; i < 6; i++) {
//     timeouts.push(setTimeout((n => () => obs(n))(i), i * 1000))
//   }
//   return () => timeouts.forEach(clearTimeout)
// })


// window.Stream = Stream

// function buildLayout(p) {
//   p.child
// }


// const p1 = Point.y()
// const p2 = Point.y(p1)
// const p3 = Point.y(p1)


// buildLayout(500, 500, p1)

// const domEv = require('lib/event')
// const observ = require('lib/emiter/observ')
// console.dir(observ)
// const mouse = observ.join({ x: domEv.mouseX, y: domEv.mouseY })
// const drag = observ.pausable(domEv.lbtn, mouse)

// drag(wesh)













