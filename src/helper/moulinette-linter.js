const is = require('lib/is')
const posRegEx = /:([0-9]+):([0-9]+)\)?$/
const anon = /<anonymous>/
const isAnon = anon.test.bind(anon)

const getErrorPositions = matchedLine => matchedLine
  ? matchedLine.split(posRegEx)
  : [1, 1]

let _lastError
window.showLast = () => _lastError

const buildError = (err, text, offset) => {
  _lastError = err.stack
  if (!err.stack) {
    console.error(err.message)
    return {
      message: err.message,
      from: { line: 0, ch: 0 },
      to: { line: 1, ch: 1 },
    }
  }
  const [ firstError, ...rest ] = err.stack.split('\n').filter(isAnon)

  const splitedText = text.split('\n')

  const buildAnnotation = (lineText, msg) => {
    const lineError = getErrorPositions(lineText)
    const line = Math.max(0, Number(lineError[1]) - offset)
    const ch = Number(lineError[2]) - 1
    const textLine = (splitedText[line] || '').slice(ch)
    const end = textLine.indexOf(' ')

    const message = is.str(msg)
      ? msg
      : `#${msg}\n${splitedText[line]}\n${lineText}`

    return {
      message,
      from: { line, ch },
      to: { line, ch: end > 0 ? (ch + end) : ch + textLine.length },
    }
  }

  return [
    buildAnnotation(firstError, err.message),
    ...rest.map(buildAnnotation),
  ]
}

module.exports = buildError
