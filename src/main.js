const p = require('layout/pure');

require('lib/debug')({ active: false });

log('main loaded')

console.log(p);
const bootstrap = require('./bootstrap')(require('./render'));
