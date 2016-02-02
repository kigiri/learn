const h = require('lib/h')
const map = require('lib/map')

const display = h.curry('#terminal-display', {
  style: { width: '100%' }
});

const line = h.curry('div.teminal-message')

const selfStyle = {
  color: '#66d9ef',
}

const puce = h.curry('span.terminal-puce')

const renderMsg = msg => h('div.terminal-message', {
  className: ((msg.type === 'user' && msg.id === localStorage.sessionId)
    ? 'self'
    : msg.type)
  },
  msg.count > 1
    ? [ puce(String(msg.count)), msg.content ]
    : msg.content)

module.exports = props => display(map(wesh(props.messageList), renderMsg))

/*
#282a36 // bg
#f8f8f2 // fg
#6D8A88 // note
#6272a4 // comment
#bd93f9 // purple
#f1fa8c // yellow
#ffb86c // orange
#ff79c6 // red
#50fa7b // green
#66d9ef // blue
*/


// TODO : support global shortcuts
// esc mode that show an overlay to set focus on the terminal or the editor
// ignore specific users
// auto suggestion for misspell commands
// add routing for sauces
