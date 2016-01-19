const video = require('component/youtube-video')();
const terminal = require('component/terminal')();
const menu = require('layout/menu');
const side = require('layout/side');
const spinner = require('layout/static/spinner');
const container = require('layout/container');

const flex = { style: { flex: 1 } };

module.exports = state => container([
  side.left(state, [
    menu(state),
    state.view ? state.view(state) : spinner,
  ]),
  side.right(state, [
    terminal(state),
    video(state.videoId),
  ]),
]);