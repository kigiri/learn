const p = require('layout/pure');

const render = state => [
  p.u(1, 1, { style: { background: 'grey' } }, 'editor'),
]

const load = observables => observables.videoId.set('tBWl9p0fH28');

module.exports = {
  render,
  load,
}