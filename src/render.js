const view = require('component/view');
const app = require('layout/app');
require('sandbox')

module.exports = state => app(state, view(state));
