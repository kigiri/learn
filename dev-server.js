const _ = require('lodash');
const webpackDevServer = require("webpack-dev-server");
const webpack = require('webpack');
const pathJoin = require('path').join;
const autoprefixer = require('autoprefixer');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getAssets = require('./assets');
const join = _.partial(pathJoin, __dirname);
// const common = require('./common.config');

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
    console.log("404s will fallback to %s", opts.historyApiFallback.index || "/index.html");
  }
}

const nodeModules = [ join('node_modules') ];

getAssets().then(assets => {
  const config = {
    errorDetails: true,
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        title: 'dev-index',
        ico: assets.ico,
        js: assets.js,
        css: assets.css,
        hash: true,
        inject: 'body',
      }),
      new ProgressBarPlugin({
        callback: logServerInfo
      }),
      // new webpack.WatchIgnorePlugin(/* pathArray or regExpr */),
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
        { test: /\.css$/, loader: "style-loader!css-loader!postcss-loader" },
      ],
    },
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
      root: join('src')
    },
    progress: true,
    output: { path: '/', filename: '/bundle.js' },
    devServer: { hot: true },
    // devtool: 'eval-source-map',
    entry: {
      main: [
        'webpack-dev-server/client?'+ protocol +'://'+ opts.host +':'+ opts.port,
        'webpack/hot/dev-server',
        './src/dev-main.js',
      ]
    },
    context: __dirname
  }

  new webpackDevServer(webpack(config), opts)
    .listen(opts.port, opts.host, err => { if (err) throw err });
})

