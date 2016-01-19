const _state = require('./state');
const _app = require('./app');
const _value = require('observ');
const document = require('global/document');
const Router = require('./router');
let render = require('./render');

require('purecss');

// Copied from examples/count.js
function App() {
  return _state({
    count: _value(0),
    _hotVersion: _value(0), // This is new - see below
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

// Need a reference to this below.
const appState = App();
_app(document.body, appState, App.render);

// module.exports = appState;
// Special sauce: detect changes to the rendering code and swap the rendering
// function out without reloading the page.
if (module.hot) {
  module.hot.accept('./render.js', function swapModule() {
    render = require('./render.js');
    // Force a re-render by changing the application state.
    appState._hotVersion.set(appState._hotVersion() + 1);
    return true;
  });
}
