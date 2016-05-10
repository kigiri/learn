const is = require('lib/is')
const map = require('lib/map')
const filter = require('lib/filter')
const reduce = require('lib/reduce')
const assignDeep = require('lib/assign-deep')

const matchVariable = /(?:(?:\/:)|(?:[?&]))([^\/?&]+)/g
const toJSON = res => {
  if (res.ok) return res.json()
  throw Object.assign(Error(res.statusText), { res })
}

module.exports = (available, baseHeaders, routes) => map(routes, base => {
  const rawUrl = is.str(base) ? base : base.url

  baseHeaders['Content-Type'] = 'application/x-www-form-urlencoded'

  return args => {
    // prepare url
    const url = rawUrl.replace(matchVariable, (src, key) => {
      const idx = key.indexOf('.')
      const part = (idx !== -1)
        ? available[key.slice(0, idx)][key.slice(idx + 1)]
        : args[key]

      console.log(src, key, part)

      if (!is.str(part)) {
        throw Error(`URL argument ${key} is not a string (type: ${typeof part})`)
      }   

      return src[0] === '/' ? ('/'+ part) : (src +'='+ part)
    })

    // clone options
    const options = assignDeep({ headers: filter(baseHeaders, is.def) }, base)

    // encode body
    if (options.body) {
      options.body = JSON.stringify(map(options.body, (fn, key) => is.fn(fn)
        ? fn(args[key])
        : fn))
    }

    return fetch(url, options).then(toJSON)
  }
})

