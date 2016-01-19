const view = require('component/view');
const app = require('layout/app');

module.exports = state => app(state, view(state));
