const document = require('global/document')
const app = require('lib/app')
const state = require('state')
const exercise = require('data/exercise')

module.exports = render => {
  document.getElementById('app').remove()
  app(document.body, state, _ => render(_))

  return {
    state,
    setRender: newRender => render = newRender
  }
}
