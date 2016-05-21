const h = require('lib/h');
const videoDisplay = require('state').observ.videoDisplay
const prepend = require('lib/prepend')

const ratio = 16 / 9

const wrapper = h.curry('#terminal-layout.fit')

const form = h.curry('form#terminal-form.pure-form', {
  style: { width: '100%' }
})

module.exports = (props, children) => wrapper({
  style: {
    // paddingTop: videoDisplay() === 'hide' ? 0 : props.width / ratio,
  },
  'ev-click': props.select,
}, children)
