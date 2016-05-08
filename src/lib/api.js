const is = require('lib/is')
const map = require('lib/map')
const reduce = require('lib/reduce')
const assignDeep = require('lib/assign-deep')

const failOnWrongType = (key, val) => {
  if (!is.str(val)) {
    throw Error(`URL argument ${key} is not a string (type: ${typeof val})`)
  }
  return val
}

const matchVariable = /\/:([^\/]+)/g
const toJSON = r => {
  if (r.ok) return r.json()
  throw Object.assign(Error(r.statusText), r)
}

module.exports = (available, baseHeaders, routes) => map(routes, base => {
  const rawUrl = is.str(base) ? base : base.url

  baseHeaders['Content-Type'] = 'application/x-www-form-urlencoded'

  return args => {
    // prepare url
    const url = rawUrl.replace(matchVariable, (_, key) => {
      const idx = key.indexOf('.')
      return '/'+ failOnWrongType(key, (idx !== -1)
        ? available[key.slice(0, idx)][key.slice(idx + 1)]
        : args[key])
    })

    // clone options
    const options = assignDeep({ headers: baseHeaders }, base)

    // encode body
    if (options.body) {
      options.body = JSON.stringify(map(options.body, (fn, key) => is.fn(fn)
        ? fn(args[key])
        : fn))
    }

    return fetch(url, options).then(toJSON)
  }
})

