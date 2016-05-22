const defaults = require('lib/defaults')

const base = {
  lint: false,
  mode: "javascript",
  theme: 'dracula',
  gutters: [ "CodeMirror-lint-markers" ],
  tabSize: 2,
  lineNumbers: true,
  lineWrapping: true,
  scrollbarStyle: 'null',
  inputStyle: 'contenteditable',
  rulers: [ { column: 80, color: '#252732', width: '2000px' } ],
}

module.exports = {
  readOnly: extend => defaults({
    readOnly: true,
    autofocus: false,
  }, base, extend),
  editable: extend => defaults({
    autofocus: true,
    readOnly: false,
    keyMap: 'sublime',
  }, base, extend),
}
  
