import is from './is'

function eachTick(subs, arg, em) {
  var max = subs.length;
  var i = -1;

  while (++i < max) {
    subs[i](arg, em);
  }
}

function dispose(subs, fn) {
  var idx = subs.indexOf(fn);
  if (idx > -1) {
    subs.splice(idx, 1);
  }
}
// TODO throttle with promises
function sub(subs, fn) {
  subs.push(fn);
  return () => dispose(subs, fn);
}

function before(subs, fn) {
  subs.unshift(fn);
  return () => dispose(subs, fn);
}

function filter(subs, fn) {
  return Emiter(next => subs.push((arg, em) => fn(arg, em) && next(arg, em)));
}

function map(subs, fn) {
  return Emiter(next => subs.push((arg, em) => next(fn(arg, em), em)));
}

function reduce(subs, fn, acc) {
  return Emiter(next => subs.push((arg, em) => next(acc = fn(acc, arg, em), em)));
}

function then(em, fn) {
  return (new Promise(resolve => once(em, resolve))).then(fn);
}

function once(em, fn) {
  var disposable = em.sub((arg, em) => (disposable(), fn(arg, em)));
  return em;
}

function Emiter(builder) {
  var emit = arg => (eachTick(subs, arg, em), em)
  var subs = [];
  var em = {
    emit,
    sub: fn => sub(subs, fn),
    map: fn => map(subs, fn),
    then: fn => then(em, fn),
    once: fn => once(em, fn),
    before: fn => before(subs, fn),
    filter: fn => filter(subs, fn),
    reduce: (fn, acc) => reduce(subs, fn, acc),
  };

  if (is.fn(builder)) {
    builder(emit);
  }

  return em;
}

export default Emiter
