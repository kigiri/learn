const fs = require('fs');
const routeDir = './src/route/';

// const entry = fs.readdirSync(routeDir)
  // .reduce((acc, dirName) => (acc[dirName] = routeDir + dirName, acc), {});

// entry.main = './src/main.js';

const entry = { main: './browser.js' };

module.exports = {
  entry,
  plugins: [],
  output: {
    filename: 'public/js/[name].js',
    chunkFilename: 'public/js/[id].js',
  },
  module: { loaders: [] }
};
