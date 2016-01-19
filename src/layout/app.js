const p = require('layout/pure');

module.exports = (state, children) => p('div', {
  id: 'app-yo-wesh',
  style: {
    height: state.viewHeight +'px',
  }
}, children);