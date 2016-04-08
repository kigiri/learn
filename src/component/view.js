const video = require('component/youtube-video')
const moulinette = require('component/moulinette')
const terminal = require('component/terminal')
const editor = require('component/editor')
const menu = require('layout/menu')
const side = require('layout/side')
const container = require('layout/container')
const tab = require('component/tab')

let i = 1
const dummy = () => String(i++)

tab.children = []

tab.x(moulinette)
tab.x(editor)
tab.x(terminal)
// const p2 = tab.y(video, editorTab)
// const p3 = tab.y(terminal, p2)

module.exports = state => container([
  tab.build(state)
  // side.left(state, editor(state)),
  // side.right(state, [
    // moulinette(state),
    // terminal(state),
    // video(state.videoId),
  // ]),
])
