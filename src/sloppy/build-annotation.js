var moulinter = require('helper/moulinette-linter')

var validator = (message, bool) => valid => {
  if (valid !== bool) {
    throw new Error(message +" FAILED !")
  }
  return message +" PASSED !"
}

var is = message => validator(message, true)

is.not = message => validator(message, false)

var does = is
var defaultAnnotation = {
  message: 'failed to compile your code',
  from: { line: 0, ch: 0 },
  to: { line: 1, ch: 0 },
}

function buildAnnotation(userCode, editorCm, cb) {
  return function getAnnotation(testCode, opts, testCm) {
    var state = { is: is, does: does }

    try {
      eval(userCode)
      cb([])
      try {
        eval(testCode)
      } catch (err2) {
        return moulinter(err2, testCode)
      }
    } catch (err) {
      cb(moulinter(err, userCode))
      return [ defaultAnnotation ]
    }
    return []
  }
}

module.exports = buildAnnotation
