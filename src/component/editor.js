const h = require('lib/h')
const ev = require('geval/event')
const { progress } = require('state').observ
const editor = require('helper/init-code-mirror')('editor', progress)

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
      lintOnChange: true,
    })

    const enableLint = () => cm.setOption('lint', {
      getAnnotations: evalCode,
      async: true
    })

    render.requestEval = () => {
      cm.setOption('lint', false)
      setTimeout(enableLint, 10)
    }

    render.requestEval()
  }
  return editor.rendered
}

render.eval = evalEvent.listen

module.exports = render
