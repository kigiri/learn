const raf = require('raf')
const ev = require('geval/event')

const loop = ev()
const after = ev()
const often = ev()

raf((prevT => function recur(t) {
  loop.broadcast(t)
  after.broadcast(t)
  if (t - prevT > 500) {
    often.broadcast(t)
    prevT = t
  }
  raf(recur)
})(0))

loop.listen.after = after.listen

loop.listen.often = often.listen // triggered every 500ms

module.exports = loop.listen
