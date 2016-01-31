const find = require('lib/find')

const posRegEx = /:([0-9]+):([0-9]+)\)?$/

const getErrorPositions = splitedStack => {
  const matchedLine = find(splitedStack, 'eval');
  return matchedLine
    ? matchedLine.split(posRegEx)
    : [1, 1]
}

module.exports = (err, text, offset) => {
  const lineError = getErrorPositions(err.stack.split('\n'))
  const line = Math.max(0, Number(lineError[1]) - offset)
  const ch = Number(lineError[2]) - 1
  const textLine = text.split('\n')[line].slice(ch)
  const end = textLine.indexOf(' ')

  return [{
    message: err.message,
    from: { line, ch },
    to: { line, ch: end > 0 ? (ch + end) : ch + textLine.length },
  }]
}
