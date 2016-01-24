const h = require('lib/h')
const videoDisplay = require('state').observ.videoDisplay

require('./terminal.css');

const ratio = 16 / 9;

const wrapper = h.curry('div.terminal-layout.pure-g', {
  style: {
    position: 'absolute',
    top: 0,
    background: '#323543',
    color: 'black',
    height: '100%',
    alignItems: 'flex-end',
  }
});

const form = h.curry('form#terminal-form.pure-form', {
  style: { width: '100%' }
});

const videoMenu = h.curry('ul.video-menu.pure-menu-list')
const button = label => h('li.video-button.pure-button.pure-button-primary', {
  style: {
    backgroundColor: '#3F414D',
    color: '#50FA7B',
    margin: '3px 5px 0 0',
  },
  'ev-click': () => videoDisplay() === label
    ? videoDisplay.set('normal')
    : videoDisplay.set(label)
}, label)

const menu = h('div.pure-menu.pure-menu-horizontal', {
  style: {
    position: 'absolute',
    letterSpacing: '0.01em',
    background: 'transparent',
    textAlign: 'right',
  }
}, videoMenu([
  button('fullscreen'),
  button('hide'),
]))

module.exports = (props, children) => wrapper({
  style: { paddingTop: videoDisplay() === 'hide' ? 0 : props.width / ratio },
}, form(children))
}, [
  menu,
  form(children),
])
