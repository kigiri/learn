const h = require('lib/h')
const editor = require('component/editor')
const buildAnnotation = require('sloppy/build-annotation')
const observables = require('state').observ
const cook = require('layout/the-cook')
const greet = require('helper/greet')
const moulinette = require('helper/init-code-mirror')('moulinette')

require('layout/moulinette.css')

const wrap = h.curry('#moulinette-wrapper')

const clearEval = editor.eval(args => args.cb([]))

const applyCook = annotations => {
  if (annotations.length) {
    observables.cookProps.set({ eye: 'x', message: annotations[0].message })
  }
  return annotations
}

const render = state => {
  if (state.codeMirror && !moulinette.loaded) {
    const cm = moulinette(state.codeMirror, { value: state.sauce.test })
    clearEval()
    editor.eval(args => cm.setOption("lint", {
      async: true,
      getAnnotations: buildAnnotation(args.text, args.cm, args.cb, applyCook)
    }))
  }
  return wrap([
    cook(observables.cookProps()),
    moulinette.rendered,
  ])
}

module.exports = render
