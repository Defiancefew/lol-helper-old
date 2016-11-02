const path = require('path');
const webpack = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');

const options = {
  devtool: 'eval-source-map',
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false
  },
  // entry: [
  //   'webpack-dev-server/client?http://localhost:3000',
  //   'webpack/hot/dev-server',
  //   './src/app/js/index'],
  entry: ['./src/main.development'],
  output: {
    path: path.join(__dirname, 'src'),
    filename: 'main.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new NpmInstallPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
  debug: true,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/,
        loaders: [
          'style?sourceMap',
          'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
        ],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css?modules&sourceMap&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          'resolve-url',
          'sass?outputStyle=expanded&sourceMap'
        ],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json',
        include: path.join(__dirname, 'src')
      }
    ]
  }
};

options.target = webpackTargetElectronRenderer(options);

module.exports = options;