import emiter from './emiter'

export default (key, src) => {
  const accessKey = ('___Observable_' + key + '__').toUpperCase();
  const target = (src || window || self);

  if (target[accessKey]) { return target[accessKey] }

  return target[accessKey] = emiter(next => target.addEventListener(key, next));
}
