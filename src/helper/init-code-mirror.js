const h = require('lib/h')
const defaultConf = require('data/cm-config-readonly')

function cleanup(id) {
  const prevElem = document.getElementById(id)
  prevElem && prevElem.firstChild && prevElem.firstChild.remove()
}

module.exports = (id, obs) => {
  const init =  (cm, extendConfig) => {
    init.loaded = true
    cleanup(id)
    const el = document.getElementById(id)
    const conf = defaultConf(extendConfig)
    conf.value = obs() || ''
    const editor = cm(el, conf)
    obs(val => editor.getDoc().setValue(val))
    return editor
  }

  init.loaded = false
  init.render = h.curry({id})
  init.rendered = init.render()
  return init
}
