const window = require('global/window')
const _vTypes = {
  VirtualText: true,
  Thunk: true,
  VirtualNode: true,
  Widget: true,
};

function isFn(fn) { return typeof fn === 'function' }
function isArr(arr) { return arr && arr.constructor === Array }
function isDef(val) { return val !== undefined }
function isNum(num) { return !isNaN(num) && typeof num === 'number' }
function isObj(obj) { return obj && typeof obj === 'object' }
function isStr(str) { return typeof str === 'string' }
function isUndef(val) { return val === undefined }
function isPromise(fn) { return fn && isFn(fn.then) && isFn(fn.catch) }
function isChild(x) { return x && _vTypes[x.type] }
function isChildren(x) { return isStr(x) || isArr(x) || isChild(x) }
function isHook(hook) {
  return hook &&
    (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
     typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

const isNode = isDef(window);
const isFloat = (float => isNum(float) && Math.floor(float) !== float);
const isInt = Number.isInteger || (int => isNum(int) && Math.floor(int) === int);

module.exports = {
  fn: isFn,
  arr: isArr,
  def: isDef,
  int: isInt,
  str: isStr,
  obj: isObj,
  num: isNum,
  node: isNode,
  undef: isUndef,
  float: isFloat,
  child: isChild,
  hook: isHook,
  promise: isPromise,
  children: isChildren,
};
