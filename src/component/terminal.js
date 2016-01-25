const calcWidth = require('helper/calc-width')
const display = require('component/terminal-display')
const layout = require('layout/terminal')
const input = require('component/terminal-input')

const render = state => layout({
  select: input.select,
  width: calcWidth(state),
}, [
  display(),
  input(),
])

module.exports = render
