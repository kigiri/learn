const store = require('lib/store')
const { isArr, isDef } = require('lib/is')

const setkey = (src, value, key) => isDef(src[key]) || (src[key] = value)

const delegate = (src, obj) => isArr(obj)
  ? defaults(src, obj)
  : store(obj, setkey, src)

const defaults = (src, objs) => store(objs, delegate, src)

module.exports = (src, ...objs) => defaults(src, objs)
