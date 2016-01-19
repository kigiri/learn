const raf = require('raf');
const ev = require('geval/event');

const loop = ev();
const after = ev();

raf(function recur(t) {
  loop.broadcast(t);
  after.broadcast(t);
  raf(recur);
});

loop.listen.after = after.listen;

module.exports = loop.listen;
