const observ = require('lib/emiter/observ')
const window = require('global/window')

const hStart = /^#\//
const enforceTrailingSlash = h => h[h.length - 1] !== '/' ? h +'/' : h
const hash = observ.format(observ.check(), h => {
  if (!h) return '#/'
  if (h[0] !== '#') {
    if (h[0] === '/') return enforceTrailingSlash('#'+ h)
    return enforceTrailingSlash('#/'+ h)
  }
  if (h[1] !== '/') return enforceTrailingSlash('#/'+ h.slice(1))
  return enforceTrailingSlash(h)
})

let inPopState = false
window.addEventListener('popstate', () => {
  inPopState = true
  hash.set(window.location.hash)
})

hash(h => {
  if (inPopState) return inPopState = false
  window.history.pushState(null, document.title, '/'+ h)
})

hash.set(window.location.hash)

hash.append = part => hash.set(hash() + part)

hash.parts = () => hash().slice(2).split('/').filter(Boolean)

module.exports = hash
