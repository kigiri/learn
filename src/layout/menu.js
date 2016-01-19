const p = require('layout/pure');
const routes = require('route');
const anchor = require('layout/global/anchor');

require('./menu.css');

module.exports = state => p.u(1, 1, p.menu.horizontal(
  p.menuList(routes.map(args =>
    anchor(state, { href: args.path }, args.label)))))
