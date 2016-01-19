const p = require('layout/pure');
const setHerf = require('lib/router').atom.set

function anchor(state, props, children) {
  const atom = state.atom;
  if (atom === props.href) {
    return p.menuItem.selected(props, children);
  }

  props['ev-click'] = ev => {
    if (!ev.ctrlKey && ev.which === 1) {
      ev.preventDefault();
      setHerf(props.href);
    }
  };

  return p.menuItem(p.menuLink(props, children));
}

module.exports = anchor;
