const p = require('layout/pure');

const props = {
  id: 'view-container',
  style: {
    height: '100%',
  },
};

module.exports = children => p('div', props, children)