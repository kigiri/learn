const layout = require('layout/terminal-input')
const handler = require('lib/key-handler')
const history = require('lib/history')
const linker = require('lib/dom-linker')
const observ = require('lib/emiter/observ')
const event = require('lib/emiter/event')
const caret = require('lib/caret')
const each = require('lib/collection/each')
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
const afterCommandEvent = event()

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

  each(() => wesh(false), val)
  el.value = str.insert(el.value, sel, ')')

  caret(el, sel)
}

const commands = {
  clear: display.clear,
  clearInput: ev => {
    const el = ev.target;
    if (el.selectionStart === el.selectionEnd) {
      el.value = ''
    }
    return false
  },
}

const execCommand = (key, ...args) => {
  console.log(...args)
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

const isCommand = val => val[0] === '/'
const commandHistory = history(50)

;(idx => {
  const historyStore = commandHistory.get();
  const retrieveCommand = (el, dir) => {
    if (idx === -1) {
      commandHistory.stash(el.value)
    }
    idx =  Math.min( Math.max(idx + dir, -1), historyStore.length - 1)
    el.value = idx < 0 ? commandHistory.stash() : historyStore[idx]
  }

  commands.getPrevCommand = ev => retrieveCommand(ev.target, -1)
  commands.getNextCommand = ev => retrieveCommand(ev.target, +1)

  afterCommandEvent.listen(cmd => {
    if (cmd !== commands.getNextCommand && cmd !== commands.getPrevCommand) {
      idx = -1
    }
  })
})(-1)


const keydown = handler({
  D: {
    meta: expandSelection,
    ctrl: expandSelection,
  },
  L: { ctrl: commands.clear },
  C: { ctrl: commands.clearInput },
  up: commands.getNextCommand,
  down: commands.getPrevCommand,
  enter: {
    none: ev => {
      const el = input.elem()
      const val = el.value
      if (isCommand(val)) {
        const error = execCommand(val.slice(1).split(' ').filter(Boolean), ev)
        if (error) {
          return execError(el, error)
        } else {
          commandHistory.push(val)
        }
      } else {
        if (val.length > 255) return execError(el, 'tooLong')
        display.post('user', val)
        ws.send.msg(val)
      }
      el.value = ''
    },
    ctrl: ev => {
      // should add a line break, but for that we need textarea instead of input
    }
  },
}, ev => (setTimeout(() => fallback(ev), false)), afterCommandEvent.broadcast)

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
