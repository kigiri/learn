const getAssets = require('../assets');
const jade = require('jade');
const sync = require('./sync');

function syncPlugin() {};

syncPlugin.prototype.apply = compiler => compiler.plugin("done", stats => sync()
  .catch(console.log));

module.exports = syncPlugin;
