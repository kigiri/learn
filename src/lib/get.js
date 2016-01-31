module.exports = {
  first: arr => arr[0],
  last: arr => arr[arr.length - 1],
  random: arr => arr[Math.floor(Math.random() * arr.length)],
  n: n => arr => arr[n],
}
