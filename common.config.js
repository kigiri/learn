const path = require('path');
const jade = require('jade');
const pathJoin = path.join;
const getAssets = require('./assets');
const nodeModules = path.join(__dirname, 'node_modules');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  errorDetails: true,
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: params => getAssets().then(assets =>
        jade.renderFile('./src/index.jade',
          Object.assign(assets, params.htmlWebpackPlugin.options))),
      title: 'LambdaSauce',
      hash: true,
      inject: 'body',
      dnsList: [
        'https://www.youtube.com/',
        'https://www.google.com/',
        'https://s.ytimg.com/',
        'https://i.ytimg.com/',
        'https://fonts.gstatic.com/',
      ]
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: nodeModules,
        loader: 'strict'
      },
      {
        test: /((\\|\/)route\2.+\2|\.async\.js$)/,
        exclude: nodeModules,
        loader: "promise?global!",
      },
      { test: /\.css$/, loader: "style-loader!css-loader?minimize!postcss-loader" },
    ]
  },
  progress: true,
  postcss: [
    autoprefixer({
      browsers: [
        'last 3 Chrome versions',
        'last 3 ff versions',
        'last 2 iOS versions',
        'last 1 Safari versions',
        'last 2 Opera versions',
        'last 3 Edge versions',
      ]
    })
  ],
  resolve: {
    root: path.join(__dirname, 'src')
  },
  output: {},
  context: __dirname
}

module.exports = config;
