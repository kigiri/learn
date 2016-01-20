const h = require('lib/h');
const is = require('lib/is');
const cuid = require('cuid');
const globalState = require('state');
const document = require('global/document');
const observ = require('observ');
const parseTag = require('virtual-dom/virtual-hyperscript/parse-tag');

module.exports = (tagName, props) => {
  props || (props = is.obj(tagName) ? tagName : {});

  const tag = parseTag(is.str(tagName) ? tagName : 'div', props);
  const elem = observ(null);

  props.id || (props.id = cuid())

  const domGetter = () => {
    const newElem = document.getElementById(props.id);

    if (newElem !== elem()) {
      elem.set(newElem);
    }
  }

  const builder = h.curry(tag, props);

  const linker = (props, children) => {
    globalState.afterNextRender(domGetter);      
    return builder(props, children);
  }

  linker.elem = fn => fn
    ? elem(fn)
    : elem() || document.getElementById(props.id);

  return linker
}
