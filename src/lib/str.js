const map = require('lib/map');

// str utils
const firstLetter = /^./;
const charFollowingDelimitors = /([-_. ]+.)/
const consecutiveSpaces = /\s\s/;
const whiteSpace = /\s/;
const wordStop = /[^A-Za-z-_]/;
const reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;
const reComboMark = /[\u0300-\u036f\ufe20-\ufe23]/g;
const toUpper = str => str.toUpperCase();
const deburredLetters = {
  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C',  '\xe7': 'c',
  '\xd0': 'D',  '\xf0': 'd',
  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N',  '\xf1': 'n',
  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss'
};

const deburrLetter = letter => deburredLetters[letter];
const deburr = str => str.replace(reLatin1, deburrLetter)
  .replace(reComboMark, '');

const matches = {
  firstLetter,
  charFollowingDelimitors,
  consecutiveSpaces,
  whiteSpace,
  wordStop,
  reLatin1,
  reComboMark,
};

const tests = map(matches, match => str => match.test(str));
tests.not = map(tests, test => str => !test(str));

module.exports = {
  tests,
  matches,
  toUpper,
  insert: (str, idx, value) => str.slice(0, idx) + value + str.slice(idx),
  toCamel: str => deburr(str).replace(charFollowingDelimitors, toUpper),
  trim: str => str.trim(),
  cleanup: str => str.trim().replace(consecutiveSpaces, ''),
  capitalize: str => str.replace(firstLetter, toUpper),
  // from lodash :
  deburr,
}
