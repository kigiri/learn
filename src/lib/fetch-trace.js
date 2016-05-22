const fetchTrace = (url, options) => {
  const errorTrace = Error('cached stack trace')

  return fetch(url, options).then(res => {
    res.__trace__ = errorTrace
    return res
  })
}

const addBindError = (fn, key) => {
  fn[key] = res => {
    if (res.ok) return res[key]()
    throw Object.assign(res.__trace__, { message: res.statusText, res })
  }
  return fn
}

module.exports = [
  'arrayBuffer',
  'formData',
  'text',
  'json',
  'blob',
].reduce(addBindError, fetchTrace)
