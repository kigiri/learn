const each = require('lib/each');
const tests = require('lib/str').tests;

// expand selection for chartype, either whiteSpace or contiunious word;
const getTest = (next, prev) => {
  if (tests.wordStop(next)) {

  } else if (tests.wordStop(prev)) {

  } else if (tests.not.whiteSpace(next) || tests.not.whiteSpace(prev)) {
    // whitespace + 1
  }
  if (tests.not.whiteSpace(curr)) {
    return tests.whiteSpace;
  }
  if (tests.wordStop(curr)) {
    return tests.not.wordStop.
  }
  return tests.wordStop;
}

module.exports = (str, pos) => {
  const ret = { start, end: str.length }

  if (!ret.end) return ret;

  const test = getTest(str[pos], str[pos - 1]);

  each(str, (c, i) => {
    if (test(c)) {
      if (i > pos) {
        ret.end = i;
        return false;
      }
      ret.start = i;
    }
  });
  return ret;
}
