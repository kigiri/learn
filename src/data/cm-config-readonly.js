const assign = require('lib/assign')

module.exports = extend => assign({
  lint: false,
  mode: "javascript",
  theme: 'dracula',
  gutters: ["CodeMirror-lint-markers"],
  tabSize: 2,
  readOnly: true,
  autofocus: false,
  lineNumbers: true,
  lineWrapping: true,
  scrollbarStyle: 'null',
}, extend)
