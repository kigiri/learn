const is = require('lib/is')

const regular = {
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  186: ';',
  187: '=',
  188: ',',
  189: '-',
  190: '.',
  191: '/',
  192: '`',
  219: '[',
  220: '\\',
  221: ']',
  222: '\'',
}

const shifted = {
  48: ')',
  49: '!',
  50: '@',
  51: '#',
  52: '$',
  53: '%',
  54: '^',
  55: '&',
  56: '*',
  57: '(',
  186: ':',
  187: '+',
  188: '<',
  189: '_',
  190: '>',
  191: '?',
  192: '~',
  219: '{',
  220: '|',
  221: '}',
  222: '"',
}

const getAlias = (ev, which) => (ev.shiftKey ? shifted : regular)[which]
  || String.fromCharCode(which)


// TODO: find the best match instead of the first and
const applyMod = (ev, prev, fn) => fn
  ? applyMod(ev, fn, (ev.ctrlKey && fn.ctrl)
  || (ev.metaKey && fn.meta)
  || (ev.altKey && fn.alt)
  || (ev.shiftKey && fn.shift)
  || fn.none)
  : prev

module.exports = (handlers, fallback, trigger) => ev => {
  let fn = handlers[ev.alias = getAlias(ev, ev.which)] || handlers[ev.which]

  if (!fn && fallback) {
    return fallback(ev)
  }

  fn = applyMod(ev, fn, fn)

  if (is.fn(fn)) {
    if (fn(ev) !== false) ev.preventDefault()
    if (is.fn(trigger)) trigger(fn)
  }
}
