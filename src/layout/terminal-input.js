const h = require('lib/h')

const form = h.curry('form#terminal-form.pure-form', {
  // style: { width: '100%' }
});

module.exports = (props, children) => form(props, children)
