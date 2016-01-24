const h = require('lib/h');

require('./terminal.css');

const ratio = 16 / 9;

const wrapper = h.curry('div.terminal-layout.pure-g', {
  style: {
    position: 'absolute',
    top: 0,
    background: 'red',
    color: 'black',
    height: '100%',
    alignItems: 'flex-end',
  }
}).style;

const form = h.curry('form.pure-form', {
  style: { width: '100%' }
});

module.exports = (props, children) => wrapper({
  paddingTop: props.width / ratio,
}, form(children))
