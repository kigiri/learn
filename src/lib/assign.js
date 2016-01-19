const store = require('./store');
const is = require('./is');

const setkey = (src, value, key) => src[key] = value;

const delegate = (src, obj) => is.arr(obj)
  ? assign(src, obj)
  : store(obj, setkey, src);

const assign = (src, objs) => store(objs, delegate, src);

module.exports = (src, ...objs) => assign(src, objs);
