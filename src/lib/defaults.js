const store = require('lib/store');
const is = require('lib/is');

const setkey = (src, value, key) => is.undef(src[key]) || (src[key] = value);

const delegate = (src, obj) => is.arr(obj)
  ? defaults(src, obj)
  : store(obj, setkey, src);

const defaults = (src, objs) => store(objs, delegate, src);

module.exports = (src, ...objs) => defaults(src, objs);
