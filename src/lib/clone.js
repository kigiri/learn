const map = require('lib/map');
const is = require('lib/is');

const set = value => is.obj(value) ? clone(value) : value;

var clone = obj => map(obj, set);

export default clone;