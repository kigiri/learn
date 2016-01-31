const h = require('lib/h')
const test00 = require('sauce/00')
const editor = require('component/editor')
const buildAnnotation = require('sloppy/build-annotation')

function cleanup() {
  const prevElem = document.getElementById('moulinette')
  prevElem && prevElem.firstChild && prevElem.firstChild.remove()
}

cleanup() // fix hot reload
let loaded = false
const moulinette = h('#moulinette')
let clearEval = editor.eval(args => args.cb([]))

const render = state => {
  if (state.codeMirror && !loaded) {
    loaded = true
    let moulmoul = state.codeMirror(document.getElementById('moulinette'), {
      theme: 'dracula',
      tabSize: 2,
      autofocus: false,
      lineNumbers: true,
      readOnly: true,
      scrollPastEnd: true,
      scrollbarStyle: 'null',
      value: test00,
      lintOnChange: false,
      gutters: ["CodeMirror-lint-markers"],
      lint: true,
      mode: "javascript",
      lintWith: {
        getAnnotations: () => []
      }
    })
    clearEval()
    editor.eval(args => moulmoul.setOption("lint", {
      getAnnotations: buildAnnotation(args.text, args.cm, args.cb)
    }))
    // setTimeout(render.eval, 10);
  }
  return moulinette
}



module.exports = render
