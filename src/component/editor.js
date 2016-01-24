const h = require('lib/h')
const each = require('lib/each')
const loop = require('lib/loop').often
const once = require('lib/once')
const keyDown = require('lib/event')

require('lib/code-mirror')
require('style/code-mirror.css')

function cleanup() {
  const prevEditor = document.getElementById('editor')
  prevEditor && prevEditor.firstChild && prevEditor.firstChild.remove()
}

module.exports = () => {
  cleanup() // fix hot reload
  let cm
  let loaded = false
  const editor = h('div#editor')
  const evalChanges = once(loop, () => {
    try {
      wesh(eval(cm.getValue()))
    } catch (err) {
      wesh(err)
    }
  });

  return state => {
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
        autofocus: true,
      })
      cm.on('change', evalChanges)
    }
    return editor
  }
}

