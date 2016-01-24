const layout = require('layout/terminal')
const handler = require('lib/key-handler')
const linker = require('lib/dom-linker')
const observ = require('observ')
const caret = require('lib/caret')
const each = require('lib/each')
const focusedElem = require('lib/event').focus
const str = require('lib/str')
const calcWidth = require('helper/calc-width')

module.exports = () => {  
  const input = linker('input#terminal-input.pure-input-1', {
    autocapitalize: "off",
    autocomplete: "off",
    autocorrect: "off",
    spellcheck: false,
    style: {
      borderRadius: 0,
      border: '1px solid transparent',
    }
  })

  const lastChar = observ('')
  const inputValue = observ('')

  lastChar(c => {
    if (c === '(') {
      const el = input.elem()
      const sel = el.selectionStart
      el.value = str.insert(el.value, sel, ')')
      caret(el, sel)
    }
  })

  const fallback = (prev => ev => {
    const el = input.elem()
    const val = el.value

    if (prev !== val) {
      inputValue.set(val)
    }

    if (val.length > prev.length) {
      prev = val
      lastChar.set(val[el.selectionStart - 1])
    } else {
      prev = val
    }
  })('')

  const expandSelection = () => {
    const el = input.elem()
    const sel = el.selectionStart
    const val = el.value

    each(val, () => wesh(false))
    el.value = str.insert(el.value, sel, ')')

    caret(el, sel)
  }

  const keydown = handler({
    D: {
      meta: expandSelection,
      ctrl: expandSelection,
    },
    enter: ev => {
      const el = input.elem()
      const val = el.value
      el.value = ''
      if (/\//.test(val)) {
        val.split(/[()]/)
      }
    }
  }, ev => (setTimeout(() => fallback(ev), false)))

  const select = () => {
    const el = input.elem()
    if (el && el !== focusedElem()) {
      el.select()
    }
  }

  const render = state => layout({
    select,
    width: calcWidth(state),
  }, input({ 'ev-keydown': keydown }))

  render.state = {
    inputValue,
    lastChar,
  }

  return render
}
