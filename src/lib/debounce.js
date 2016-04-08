module.exports = (fn, delta, imediate) => {
  let clear
  return (...args) => {
    clearTimeout(clear)
    if (imediate) {
      fn(...args)
      return imediate = false
    }
    return clear = setTimeout(() => fn(...args), delta)
  }
}
