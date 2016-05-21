const matchingDelimiters = {
  '{': '}',
  '(': ')',
  '<': '>',
  '[': ']',
}

const findScopeDelimiters = (text, idx = 0) => {
  const start = text[idx]
  const end = matchingDelimiters[start]
  const max = text.length
  let level = 0
  while (++idx < max) {
    switch (text[idx]) {
      case start: ++level; break
      case end: {
        if (!level) return idx
        --level
        break
      }
      default: break
    }
  }
  throw new Error('syntax error ??? ?')
}

module.exports = findScopeDelimiters