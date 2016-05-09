const moulinette = require('component/moulinette')
const container = require('layout/container')
const editor = require('component/editor')
const tab = require('component/tab')

tab.children = []
tab.x(editor)
tab.x(moulinette)

module.exports = state => container(tab.build(state))
