const go = history ? url => history.pushState(null, null, url) :  _ => _

export default (state, url) => {
  if (state.url === url) { return false }
  if (location.pathname !== url) { go(url) }
  state.url = url
}