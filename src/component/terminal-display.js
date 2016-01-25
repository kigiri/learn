const ws = require('lib/ws')
const layout = require('layout/terminal-display')
const window = require('global/window')
const ev = require('geval/event')
const messagesCount = require('state').observ.messagesCount
const is = require('lib/is')
const messageList = []
const onmessage = ev()
const assign = require('lib/assign')
const id = window.localStorage.sessionId
const last = arr => arr[arr.length - 1]

const broadcast = (type, content) => onmessage.broadcast({
  time: Date.now(),
  id,
  type,
  content: String(content),
})

const curryError = content => details => broadcast('error', details
  ? content +' : '+ details
  : content)

const log = content => broadcast('log', content)
const error = content => broadcast('error', content)

error.commandNotFound = curryError('Command not found')
error.tooLong = curryError('Message too long')

onmessage.listen(msg => {
  const lastMsg = last(messageList)
  if (lastMsg &&  lastMsg.id === msg.id && lastMsg.content === msg.content) {
    lastMsg.count++
  } else {
    msg.count = 1
    messageList.push(msg)
  }
  messagesCount.set(messageList.length)
})

const render = () => layout({ messageList })

render.post = onmessage.broadcast

ws.on.msg(msg => onmessage.broadcast(assign({type: 'user'}, msg)))

render.clear = () => messagesCount.set(messageList.length = 0)

render.error = error

render.log = log

module.exports = render
