const layout = require('layout/terminal-input')
const handler = require('lib/key-handler')
const linker = require('lib/dom-linker')
const observ = require('observ')
const caret = require('lib/caret')
const each = require('lib/each')
const focusedElem = require('lib/event').focus
const str = require('lib/str')
const ws = require('lib/ws')
const display = require('component/terminal-display')

// const findWordBoundaries = require('lib/text/find-word-boundaries')

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

const commands = {
  clear: display.clear
}

const execCommand = (key, ...args) => {
  const cmd = commands[key]
  if (cmd) {
    return cmd(...args)
  }
  return 'commandNotFound'
}

const execError = (el, error, ...args) => {
  display.error[error](...args)
  el.select()
}

const keydown = handler({
  D: {
    meta: expandSelection,
    ctrl: expandSelection,
  },
  L: {
    ctrl: display.clear
  },
  enter: {
    none: ev => {
      const el = input.elem()
      const val = el.value
      if (/^\//.test(val)) {
        const error = execCommand(val.slice(1).split(' '))
        if (error) return execError(el, error)
      } else {
        if (val.length > 255) return execError(el, 'tooLong')
        ws.send.msg(val)
      }
      el.value = ''
    },
    ctrl: ev => {
      // should add a line break, but for that we need textarea instead of input
    }
  },
}, ev => (setTimeout(() => fallback(ev), false)))

const select = () => {
  const el = input.elem()
  if (el && el !== focusedElem()) {
    el.select()
  }
}

const virtualInput = layout(input({ 'ev-keydown': keydown }))
const render = () => virtualInput

render.state = {
  lastChar,
  value: inputValue,
}

render.select = select

module.exports = render
