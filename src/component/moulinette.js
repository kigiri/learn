const buildAnnotation = require('sloppy/build-annotation')
const observables = require('state').observ
const moulinette = require('helper/init-code-mirror')('moulinette', observables.test)
const editor = require('component/editor')
const greet = require('helper/greet')
const cook = require('layout/the-cook')
const theCook = require('component/the-cook')
const h = require('lib/h')

const wrap = h.curry('#moulinette-wrapper')

const clearEval = editor.eval(args => args.cb([]))
const applyCook = annotations => {
  if (annotations.length) {
    theCook.say('x', annotations[0].message, true)
  }
  return annotations
}

const render = state => {
  if (state.codeMirror && !moulinette.loaded) {
    const cm = moulinette(state.codeMirror)

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
