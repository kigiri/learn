const find = require('lib/find')

const posRegEx = /<anonymous>:([0-9]+):([0-9]+)\)$/

const getErrorPositions = splitedStack => {
  const matchedLine = find(splitedStack, posRegEx);
  if (matchedLine) {
    return matchedLine.split(posRegEx)
  }
  console.log(splitedStack.join('\n'))
  return [1, 1]
}

module.exports = (err, text) => {
  const lineError = getErrorPositions(err.stack.split('\n'))
  const line = Number(lineError[1]) - 1
  const ch = Number(lineError[2]) - 1
  const textLine = text.split('\n')[line].slice(ch)
  const end = textLine.indexOf(' ')

  return [{
    message: err.message,
    from: { line, ch },
    to: { line, ch: end > 0 ? (ch + end) : ch + textLine.length },
  }]
}
