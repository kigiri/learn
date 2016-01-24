const cuid = require('cuid')
const window = require('global/window')
const ev = require('geval/event')
const is = require('lib/is')
const often = require('lib/loop').often
const bakelog = msg => (...args) => (console.log(msg, ...args), args[0]) // TODO: add stack
const log = (...args) => (console.log(...args), args[0])
const typeList = [
  'data',
  'msg',
]

const id = window.localStorage.sessionId || cuid()
window.localStorage.sessionId = id

function formatContent(content) {
  if (is.str(content)) return content
  return JSON.stringify(content)
}

const send = ev()
const recieve = ev()
const on = recieve.listen
const addType = type => {
  send.broadcast[type] = data => send.broadcast(type +':'+ formatContent(data))
  recieve[type] = ev()
  on[type] = recieve[type].listen
}

const onerror = console.error.bind(console)
const onclose = ev => connected = false
const onmessage = ev => {
  const data = ev.data
  recieve.broadcast(ev)
  if (!data) return

  const pos = data.indexOf(':')
  const type = data.slice(0, pos)
  const reciever = recieve[type]
  if (!reciever) return

  reciever.broadcast(data.slice(pos + 1))
}

let connected = false
const connect = () => {
  if (connected) return
  const ws = new WebSocket("ws://learn.cdenis.net:7266/")
  ws.onopen = ev => {
    connected = true
    ws.send(id)
  }
  ws.onerror = onerror
  ws.onclose = onclose
  ws.onmessage = onmessage
  send.listen(content => ws.send(content))
}

often(connect)

typeList.forEach(addType)

module.exports = {
  on,
  send: send.broadcast,
  addType,
}
