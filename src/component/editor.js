const h = require('lib/h')
const each = require('lib/each')
const keyDown = require('lib/event')
const display = require('component/terminal-display')
const ev = require('geval/event')

require('lib/code-mirror')
require('style/code-mirror.css')

function cleanup() {
  const prevEditor = document.getElementById('editor')
  prevEditor && prevEditor.firstChild && prevEditor.firstChild.remove()
}

cleanup() // fix hot reload
let loaded = false
const editor = h('div#editor')

const evalEvent = ev()

const evalCode = (text, cb, opts, cm) => {
  evalEvent.broadcast({ text, cb, cm })
  return []
}

const render = state => {
  if (state.codeMirror && !loaded) {
    loaded = true
    state.codeMirror(document.getElementById('editor'), {
      theme: 'dracula',
      tabSize: 2,
      autofocus: true,
      lineNumbers: true,
      scrollPastEnd: true,
      scrollbarStyle: 'null',
      inputStyle: 'contenteditable',
      rulers: [ { column: 80, color: '#252732', width: '2000px' } ],
      keyMap: 'sublime',
      value: "const user = {\n   /* set your user name and password */\n}\n",
      lintOnChange: true,
      lint: {
        getAnnotations: evalCode,
        async: true,
      },
      gutters: ["CodeMirror-lint-markers"],
      mode: "javascript",
    })
  }
  return editor
}

render.eval = evalEvent.listen

module.exports = render
