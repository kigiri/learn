const codeMirrorInit = require('helper/init-code-mirror')
const defaultConf = require('data/cm-config')
const evalTheCode = require('helper/eval-the-code')
const observables = require('state').observ
const theCook = require('component/the-cook')
const editor = require('component/editor')
const greet = require('helper/greet')
const cook = require('layout/the-cook')
const each = require('lib/collection/each')
const h = require('lib/h')

const moulinette = codeMirrorInit('moulinette', observables.test)
const wrap = h.curry('#moulinette-wrapper')

const clearEval = editor.eval(args => args.cb([]))
const applyCook = annotations => {
  if (annotations.length) {
    theCook.say('x', annotations[0].message, true)
  }
  return annotations
}

const readOnlyConf = defaultConf.readOnly()
const editableConf = defaultConf.editable()

let _prevToCleanup = () => {}
const render = state => {
  if (state.codeMirror && !moulinette.loaded) {
    const cm = moulinette(state.codeMirror)
    const applyOptions = each((value, key) => cm.setOption(key, value))

    applyOptions(state.editorMode ? editableConf : readOnlyConf)

    _prevToCleanup()
    _prevToCleanup = observables.editorMode(active => applyOptions(active
      ? editableConf
      : readOnlyConf))

    clearEval()
    editor.eval(args => cm.setOption("lint", {
      async: true,
      getAnnotations: evalTheCode(args, applyCook)
    }))
  }
  return wrap([
    cook(observables.cookProps()),
    moulinette.rendered,
  ])
}

module.exports = render
