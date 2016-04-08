module.exports = {
  remove: (arr, elem) => {
    if (!arr) return
    const idx = arr.indexOf(elem)
    if (idx < 0) return
    arr.splice(idx, 1)
  },
  n: n => arr => arr[n],
  first: arr => arr[0],
  last: arr => arr[arr.length - 1],
  random: arr => arr[Math.floor(Math.random() * arr.length)],
  inRange: (arr, idx) => Math.min(Math.max(idx, 0), arr.length - 1),
}
