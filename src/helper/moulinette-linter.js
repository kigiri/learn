const find = require('lib/find')
const posRegEx = /:([0-9]+):([0-9]+)\)?$/
const findEval = find(/[( ]eval[ :]/)

const getErrorPositions = splitedStack => {
  const matchedLine = findEval(splitedStack)

  return matchedLine
    ? matchedLine.split(posRegEx)
    : [1, 1]
}

const buildError = (err, text, offset) => {
  if (!err.stack) {
    console.error(err.message)
    return {
      message: err.message,
      from: { line: 0, ch: 0 },
      to: { line: 1, ch: 1 },
    }
  }
  const lineError = getErrorPositions(err.stack.split('\n'))
  const line = Math.max(0, Number(lineError[1]) - offset)
  const ch = Number(lineError[2]) - 1
  const textLine = (text.split('\n')[line] || '').slice(ch)
  const end = textLine.indexOf(' ')

  return {
    message: err.message,
    from: { line, ch },
    to: { line, ch: end > 0 ? (ch + end) : ch + textLine.length },
  }
}

const toArray = (err, text, offset) => [buildError(err, text, offset)]

toArray.buildError = buildError

module.exports = toArray
