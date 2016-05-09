const h = require('lib/h')
const keyDown = require('lib/event')
const display = require('component/terminal-display')
const ev = require('geval/event')
const editor = require('helper/init-code-mirror')('editor')

require('lib/code-mirror')
require('style/code-mirror.css')

const evalEvent = ev()

const evalCode = (text, cb, opts, cm) => {
  evalEvent.broadcast({ text, cb, cm })
  return []
}

const render = state => {
  if (state.codeMirror && !editor.loaded) {
    const cm = editor(state.codeMirror, {
      autofocus: true,
      readOnly: false,
      inputStyle: 'contenteditable',
      rulers: [ { column: 80, color: '#252732', width: '2000px' } ],
      keyMap: 'sublime',
      value: window.localStorage[state.sauce] || '',
      lintOnChange: true,
    })
    setTimeout(() => cm.setOption("lint", {
      getAnnotations: evalCode,
      async: true
    }), 10);
  }
  return editor.rendered
}

render.eval = evalEvent.listen

module.exports = render
