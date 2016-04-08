const p = require('layout/pure');

const props = {
  id: 'view-container',
  style: {
    display: 'flex',
    height: '100%',
  },
};

module.exports = children => p('div', props, children)
