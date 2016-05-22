const is = require('lib/is')
const map = require('lib/map')
const get = require('lib/fetch-trace')
const filter = require('lib/filter')
const reduce = require('lib/reduce')
const assignDeep = require('lib/assign-deep')

const matchVariable = /(?:(?:\/:)|(?:[?&]))([^\/?&]+)/g

const api = (available, baseHeaders, routes, parserKey) => map(routes, base => {
  const parser = get[parserKey] || get.json
  let rawUrl
  if (is.str(base)) {
    rawUrl = base
    base = null
  } else {
    rawUrl = base.url
  }

  baseHeaders['Content-Type'] = 'application/x-www-form-urlencoded'

  return args => {
    // prepare url
    const url = rawUrl.replace(matchVariable, (src, key) => {
      const idx = key.indexOf('.')
      const part = (idx !== -1)
        ? available[key.slice(0, idx)][key.slice(idx + 1)]
        : args[key]

      if (!is.str(part)) {
        throw Error(`URL argument ${key} is not a string (type: ${typeof part})`)
      }   

      return src[0] === '/' ? (`/${part}`) : (`${src}=${part}`)
    })

    // clone options
    const options = {
      headers: filter(baseHeaders, is.def),
      method: base && base.method || 'GET',
    }

    // encode body
    if (base && base.body) {
      options.body = wesh(JSON.stringify(map(base.body, (fn, key) => is.fn(fn)
        ? fn(args[key])
        : fn)))
    }

    return get(url, options).then(parser)
  }
})

module.exports = api
