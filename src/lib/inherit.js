const each = require('lib/each');

module.exports = (proto, state) => {
  each(proto, key => state[key] = (...args) => proto[key](state, ...args));
  return state;
}
