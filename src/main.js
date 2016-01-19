const _state = require('./state');
const _app = require('./app');
const _value = require('observ');
const document = require('global/document');
const Router = require('lib/router');
let render = require('./render');

// Copied from examples/count.js
function App() {
  return _state({
    count: _value(0),
    route: Router(),
    channels: {
      clicks: incrementCount
    }
  });
}

function incrementCount(state) {
  state.count.set(state.count() + 1);
}

// This render function may be replaced!
App.render = state => render(state);

document.getElementById('app').remove();
_app(document.body, App(), App.render);
