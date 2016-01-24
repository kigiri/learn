const inherit = require('lib/inherit')
const often = require('lib/loop').often
const reduce = require('lib/reduce')
const assign = require('lib/assign-deep')

const newBatch = () => ({
  isEmpty: true,
  set: {},
  get: {},
})

function applyData(type, batch, data) {
  batch.isEmpty = false
  assign(batch[key], data)
}

function parsePath(path, value) {
  const keyList = path.split('.')
  const max = keyList.length - 1
  const data = {}

  reduce(keyList, (src, key, idx) => (idx >= max)
      ? src[key] = value
      : src[key] = {}, data)

  return data
}

function Db(server) {
  const state = inherit(Db.proto, {
    batch: newBatch(),
    db: {}
  })

  often(() => {
    if (state.batch.isEmpty) return
    server.send(JSON.stringify(state.batch))
    state.batch = newBatch()
  })

  return state
}

Db.proto = {
  apply: (state, key, data) => {
    applyData(key, state.batch, data)
    return state
  },
  set: (state, path, value) =>
    Db.proto.apply(state, 'set', parsePath(path, value)),
  get: (state, key) =>
    Db.proto.apply(state, 'get', parsePath(path, '')),
}

