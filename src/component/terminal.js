const layout = require('layout/terminal');
const handler = require('lib/key-handler');
const linker = require('lib/dom-linker');
const observ = require('observ');
const caret = require('lib/caret');
const str = require('lib/str')
const each = require('lib/each')
// const findWordBoundaries = require('lib/text/find-word-boundaries')


// console.log(findWordBoundaries('  salut.c   ', 4))
// console.log(findWordBoundaries('  salut.c   ', 5))
// console.log(findWordBoundaries('  salut.c   ', 6))
// console.log(findWordBoundaries('  salut.c   ', 9))
// console.log(findWordBoundaries('  salut.c   ', 0))

module.exports = () => {  
  const input = linker('input#terminal-input.pure-input-1', {
    style: {
      borderRadius: 0,
      border: '1px solid transparent'
    }
  });

  const lastChar = observ('');
  const inputValue = observ('');

  lastChar(c => {
    if (c === '(') {
      const el = input.elem();
      const sel = el.selectionStart;
      el.value = str.insert(el.value, sel, ')');
      caret(el, sel);
    }
  })

  const fallback = (prev => ev => {
    const el = input.elem();
    const val = el.value;

    if (prev !== val) {
      inputValue.set(val);
    }

    if (val.length > prev.length) {
      prev = val;
      lastChar.set(val[el.selectionStart - 1]);
    } else {
      prev = val;
    }
  })('');

  const expandSelection = () => {
    const el = input.elem();
    const sel = el.selectionStart;
    const val = el.value;

    each(val, () => log(false))
    el.value = str.insert(el.value, sel, ')');

    caret(el, sel);
  }

  const keydown = handler({
    D: {
      meta: expandSelection,
      ctrl: expandSelection,
    },
    enter: ev => {
      const el = input.elem()
      const val = el.value;

      if (/\//.test(val)) {
        log(val.split(/[()]/))
      }
    }
  }, ev => (setTimeout(() => fallback(ev), false)));

  const render = state => layout({
    width: state.viewWidth * state.split,
  }, log(input({ 'ev-keydown': keydown }), 'wesh'));

  render.state = {
    inputValue,
    lastChar,
  }

  return render;
}
