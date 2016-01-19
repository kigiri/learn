import each from './each'
import assign from './assign'
import { isObj } from './is'

const concatName = (base, end) => end.toUpperCase() + (base && '_'+ base)
function flatten(flat, obj, path) {
  return (each(obj, (value, key) => isObj(value)
    ? flatten(flat, value, log(concatName(path, key, "path", path, "obj", obj)))
    : flat[concatName(path, key)] = value), flat)
}

export default reducers => flatten({}, log(assign({}, reducers), "wesh"), '');
