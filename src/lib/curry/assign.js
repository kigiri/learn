const assign = require('lib/assign');

const curryAssign = (...baseObjs) => (...newObjs) => assign({}, ...baseObjs, ...newObjs);
const curryAssign.one = baseObj => newObj => assign({}, baseObj, newObj);

module.exports = curryAssign;
