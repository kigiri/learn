const defaults = require('lib/default');
const p = require('layout/pure');


const defaultsProps = {
  'ev-keydown': ev => console.log(ev)
}

const getProps = (show, props) => defaults((show
  ? { className: 'modal fade in', tabIndex: 0 }
  : { className: 'modal hide fade', tabIndex: -1 }), props, defaultsProps);

module.exports = (state, children) => p('div', getProps(true, {id: 'modal'}), children)
