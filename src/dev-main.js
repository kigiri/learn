const window = require('global/window');

require('lib/debug')({
  active: true,
  trace: true,
  timestamp: true,
});

wesh('dev-main loaded')

const bootstrap = require('./bootstrap')(require('./render'));
const hotVersion = bootstrap.state.observ._hotVersion;

window.pouet = bootstrap.state.observ;

if (module.hot) {
  module.hot.accept('./render', function () {
    console.log('hot-relourde', bootstrap);
    bootstrap.setRender(require('./render'));
    hotVersion.set(hotVersion() + 1);
    return true;
  });
}
