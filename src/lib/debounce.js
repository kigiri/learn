module.exports = (clear => (fn, delta, imediate) => (...args) => {
  clearTimeout(clear)
  if (imediate) {
    fn(...args)
    return imediate = false
  }
  return clear = setTimeout(() => fn(...args), delta)
})()
