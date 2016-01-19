const _ = require('lodash');
const fs = require('fs');
const webpack = require('webpack');
const _path = require('path');
const pathJoin = _path.join;
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const join = _.partial(pathJoin, __dirname);
const include = [ _path.resolve(__dirname, 'src') ];

// require('./copyAssets');

const routeDir = './src/route/';
const entry = fs.readdirSync(routeDir).reduce((acc, dirName) => {
  if (/^index\.js$/.test(dirName)) {
    acc[dirName] = routeDir + dirName
  }
  return acc;
}, {});

entry.main = './src/main.js';

const config = {
  errorDetails: true,
  cache: false,
  plugins: [
    new ProgressBarPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: 'core' }),
    new webpack.optimize.UglifyJsPlugin({
      exclude: /[-_.]min\.js/i,
      sourceMap: false,
      compress: { warnings: false }
    }),
  ],
  module: {
    loaders: [{
        test: /\.jsx?$/,
        include,
        loader: 'babel',
        query: {
          presets: ['modern']
        }
      },
      {
        test: /\.js$/,
        exclude: [ join('node_modules') ],
        loader: 'strict'
      },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
  progress: true,
  output: { 
    filename: 'test/js/[name].js',
    chunkFilename: 'test/js/[id].js'
  },
  entry
}

module.exports = config;

// webpack(config, (err, stats) => {
//   if (err) {
//     return console.error(err);
//   }
//   console.log(new Set(stats.compilation.fileDependencies
//     .map(name => name.split('/'))
//     .map(name => name[name.indexOf('node_modules') + 1])
//     .filter(Boolean)));
// })