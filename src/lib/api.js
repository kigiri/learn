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

const toText = res => {
  if (res.ok) return res.text()
  throw Object.assign(Error(res.statusText), { res })
}

const api = (available, baseHeaders, routes) => map(routes, base => {
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
    if (options.body) {
      options.body = JSON.stringify(map(options.body, (fn, key) => is.fn(fn)
        ? fn(args[key])
        : fn))
    }

    const errorTrace = Error('cached stack trace')

    return fetch(url, options).then(toJSON).catch(err => {
      errorTrace.message = err.message
      throw errorTrace
    })
  }
})

module.exports = Object.assign(api, { toText, toJSON })
