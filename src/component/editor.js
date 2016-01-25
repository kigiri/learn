const h = require('lib/h')
const each = require('lib/each')
const loop = require('lib/loop').often
const once = require('lib/once')
const keyDown = require('lib/event')
const display = require('component/terminal-display')
const debounce = require('lib/debounce')

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
      lineNumbers: true,
      theme: 'dracula',
      tabSize: 2,
      scrollPastEnd: true,
      value: "function myScript() { return 100 }\n",
      mode: "javascript",
      inputStyle: 'contenteditable',
      scrollbarStyle: 'null',
      keyMap: 'sublime',
      rulers: [ { column: 80, color: '#252732', width: '2000px' } ],
      autofocus: true,
    })
    cm.on('change', evalChanges)
  }
  return editor
}

module.exports = render
