const observ = require('observ');
const source = require('geval/source');
const window = require('global/window');
const document = require('global/document');

const originLen = document.location.origin.length;
const atom = observ(String(document.location.href).slice(originLen));
const view = observ(() => {});

window.observ = observ;
let inPopState = false;

const popstate = () => source(broadcast => window.addEventListener('popstate',
  () => broadcast(String(document.location.href).slice(originLen))))

popstate()(uri => (inPopState = true, atom.set(uri)));

atom(uri => {
  if (inPopState) {
    inPopState = false;
    return;
  }
  window.history.pushState(null, document.title, uri);
});

module.exports = {
  atom,
  view,
}
