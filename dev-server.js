const _ = require('lodash');
const webpackDevServer = require("webpack-dev-server");
const webpack = require('webpack');
const pathJoin = require('path').join;
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./common.config.js');
const getAssets = require('./assets');
const join = _.partial(pathJoin, __dirname);

const opts = {
  host: 'localhost',
  port: 8080,
  publicPath: '/',
  outputPath: '/',
  filename: '/bundle.js',
  // watchOptions: undefined,
  // watchDelay: undefined,
  historyApiFallback: true,
  hot: true,
  https: false,
  errorDetails: true,
  contentBase: __dirname,
  stats: {
    errorDetails: true,
    cached: false,
    cachedAssets: false,
    colors: true,
  },
  inline: true
};

const protocol = opts.https ? "https" : "http";

function logServerInfo() {
  const slug = opts.inline ? '/' : '/webpack-dev-server/';
  console.log(protocol + "://" + opts.host + ":" + opts.port + slug);
  console.log("webpack result is served from " + opts.publicPath);

  if (typeof opts.contentBase === "object") {
    console.log("requests are proxied to " + opts.contentBase.target);
  } else {
    console.log("content is served from " + opts.contentBase);
  }
  if (opts.historyApiFallback) {
    console.log("404s will fallback to %s", opts.historyApiFallback.index
      || "/index.html");
  }
}

const nodeModules = [ join('node_modules') ];

getAssets().then(assets => {
  const config = _.defaults({
    output: { path: '/', filename: '/bundle.js' },
    devServer: { hot: true },
    // devtool: 'eval-source-map',
    entry: {
      main: [
        'webpack-dev-server/client?'+ protocol +'://'+ opts.host +':'
          + opts.port,
        'webpack/hot/only-dev-server',
        './src/dev-main.js',
      ]
    }
  }, commonConfig);

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ProgressBarPlugin({ callback: logServerInfo })
    // new webpack.WatchIgnorePlugin(/* pathArray or regExpr */),
  );

  new webpackDevServer(webpack(config), opts)
    .listen(opts.port, opts.host, err => { if (err) throw err });
}).catch(err => console.log(err))

