const h = require('lib/h')
const each = require('lib/each')
const loop = require('lib/loop').often
const once = require('lib/once')
const keyDown = require('lib/event')
const display = require('component/terminal-display')
const debounce = require('lib/debounce')
const moulint = require('helper/moulinette-linter')


require('lib/code-mirror')
require('style/code-mirror.css')

function cleanup() {
  const prevEditor = document.getElementById('editor')
  prevEditor && prevEditor.firstChild && prevEditor.firstChild.remove()
}

cleanup() // fix hot reload
let cm
let loaded = false
const editor = h('div#editor')
const evalChanges = debounce(once(loop, () => {
  try {
    display.log(eval(cm.getValue()))
  } catch (err) {
    display.error(err.message)
  }
}), 1000)

const render = state => {
  if (state.codeMirror && !loaded) {
    loaded = true
    window.cm = cm = state.codeMirror(document.getElementById('editor'), {
      theme: 'dracula',
      tabSize: 2,
      autofocus: true,
      lineNumbers: true,
      scrollPastEnd: true,
      scrollbarStyle: 'null',
      inputStyle: 'contenteditable',
      rulers: [ { column: 80, color: '#252732', width: '2000px' } ],
      keyMap: 'sublime',
      value: "function myScript() { return 100 }\n",
      lintOnChange: false,
      gutters: ["CodeMirror-lint-markers"],
      lint: true,
      mode: "javascript",
    })
    cm.on('change', evalChanges)
    state.codeMirror.registerHelper("lint", "javascript", moulint)
  }
  return editor
}

module.exports = render
