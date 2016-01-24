const _ = require('lodash');
const fs = require('fs');
const webpack = require('webpack');
const _path = require('path');
const pathJoin = _path.join;
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const syncPlugin = require('./tools/syncPlugin');
const join = _.partial(pathJoin, __dirname);
const include = [ _path.resolve(__dirname, 'src') ];
const commonConfig = require('./common.config.js');

// require('./copyAssets');

const config = _.defaults({
  cache: false,
  output: { 
    filename: '[name].js',
    chunkFilename: 'chunk-[name].js',
    path: 'public'
  },
  entry: './src/main.js'
}, commonConfig);

config.plugins.push(new ProgressBarPlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(true),
  new webpack.optimize.AggressiveMergingPlugin(),
  new syncPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    exclude: /[-_.]min\.js/i,
    sourceMap: false,
    comments: false,
    compress: { warnings: false }
  }),
  new webpack.optimize.MinChunkSizePlugin({
    minChunkSize: 35000, // should safely be compressed under 3
  })
)

config.module.loaders.push({
  test: /\.jsx?$/,
  include,
  loader: 'babel',
  query: { presets: ['modern'] }
});

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
