const promisify = require('./tools/promisify');
const config = require('./webpack.config');
const webpack = promisify(require('webpack'));
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getAssets = require('./assets');
const sync = require('./tools/sync');

getAssets().then(assets => {
  config.plugins.push(new HtmlWebpackPlugin({
    template: 'src/index.html',
    title: 'LambdaSauce',
    ico: assets.ico,
    js: assets.js,
    css: assets.css,
    hash: true,
    inject: 'body',
  }))
  return webpack(config);
}).then(sync).catch(console.log)
