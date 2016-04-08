const each = require('lib/each');

module.exports = (proto, state) => {
  each(key => state[key] = (...args) => proto[key](state, ...args), proto);
  return state;
}
