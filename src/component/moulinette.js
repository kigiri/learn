const h = require('lib/h')
const test00 = require('sauce/00')
const editor = require('component/editor')
const buildAnnotation = require('sloppy/build-annotation')
const cook = require('layout/the-cook')
const greet = require('helper/greet')

require('layout/moulinette.css')

function cleanup() {
  const prevElem = document.getElementById('moulinette')
  prevElem && prevElem.firstChild && prevElem.firstChild.remove()
}

cleanup() // fix hot reload
let loaded = false
const moulinette = h('#moulinette')
let clearEval = editor.eval(args => args.cb([]))
const cookProps = {
  eye: 'o',
  message: greet(),
}

const applyCook = annotations => {
  if (annotations.length) {
    cookProps.eye = 'x'
    cookProps.message = annotations[0].message
  } else {
    cookProps.eye = 'o'
    cookProps.message = greet()
  }
  return annotations
}

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
      lint: false,
      mode: "javascript",
    })
    clearEval()
    editor.eval(args => moulmoul.setOption("lint", {
      getAnnotations: buildAnnotation(args.text, args.cm, args.cb, applyCook)
    }))
  }
  return [
    cook(cookProps),
    moulinette,
  ]
}



module.exports = render
