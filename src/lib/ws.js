const cuid = require('cuid')
const window = require('global/window')
const ev = require('geval/event')
const is = require('lib/is')
const often = require('lib/loop').often
const typeList = [
  'handshake',
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
const onmessage = ev => {
  const data = ev.data
  recieve.broadcast(ev)
  if (!data) return

  const pos = data.indexOf(':')
  const type = data.slice(0, pos)
  const reciever = recieve[type]
  if (!reciever) return

  try {
    reciever.broadcast(JSON.parse(data.slice(pos + 1)))
  } catch (e) {
    wesh('error while parsing WebSocket message:', data, e)
  }
}

const connect = (connected => () => {
  if (connected) return
  const clear = send.listen(content => ws.send(content))
  const ws = new WebSocket("ws://learn.cdenis.net:7266/")
  ws.onopen = ev => {
    ws.send('handshake:'+ id)
  }
  ws.onerror = onerror
  ws.onclose = ev => {
    clear()
    connected = false
  }
  ws.onmessage = onmessage
  connected = true
})(false)

often(connect)

typeList.forEach(addType)

module.exports = {
  on,
  send: send.broadcast,
  addType,
}
