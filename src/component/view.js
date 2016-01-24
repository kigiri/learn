const video = require('component/youtube-video')();
const terminal = require('component/terminal')();
const editor = require('component/editor')();
const menu = require('layout/menu');
const side = require('layout/side');
const container = require('layout/container');

const flex = { style: { flex: 1 } };

module.exports = state => container([
  side.left(state, editor(state)),
  side.right(state, [
    terminal(state),
    video(state.videoId),
  ]),
]);
