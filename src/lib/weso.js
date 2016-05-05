const Ev = require('geval/event')
const window = require('global/window')
const cuid = require('cuid')
const initWeso = require('lib/initweso')
const id = window.localStorage.sessionId || cuid()

const defaultPort = 7266

const getProtocol = secure => secure ? 'wss' : 'ws'

const init = opts => {
  if (!opts.url) throw Error('You need to specify a server url')

  const port = opts.port || defaultPort
  const retryDelay = opts.retryDelay
  const url = getProtocol(opts.secure) +'://'+ opts.url +':'+ port +'/'

  const weso = initWeso(opts)

  const open = Ev()
  const close = Ev()
  const error = Ev()

  const connect = () => {
    const ws = new WebSocket(url)

    // Foward message send by weso
    const clear = weso.listen(content => ws.send(content))

    ws.ws = ws
    const wsObj = { ws }
    const assignWs = val => Object.assign(val || {}, wsObj)

    // Foward message send to weso
    ws.onmessage = ({ data }) => weso.onmessage(data, ws)

    // Foward errors
    ws.onerror = err => error.broadcast(assignWs(err))

    // Cleanup on socket close
    ws.onclose = ev => {
      close.broadcast(assignWs(ev))
      clear()
      if (retryDelay) {
        setTimeout(connect, retryDelay)
      }
    }

    ws.onopen = ev => {
      // Send ID to server
      ws.send('handshake:'+ id)
      open.broadcast(ws)
    }
  }

  weso.on = {
    open: open.listen,
    close: close.listen,
    error: error.listen,
  }

  connect()
  return weso
}

module.exports = init

/*
  options :

  url: (required, ex: 'host.domain.com')
  port: 7266 (default, optional)
  secure: false (default, optional)
  retryDelay: 0 (0 = disabled, value in ms, optional)

  + all weso options
*/
