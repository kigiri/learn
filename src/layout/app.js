const h = require('lib/h');

const app = h.curry('#app-yo-wesh').style;

module.exports = (state, children) => app({
  height: state.viewHeight,
}, children);
