const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'eval',
  target: 'electron-renderer',
  debug: true,
  entry: {
    bundle: [
      'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr&reload=true',
      './src/app/js/index'
    ],
    vendor: [
      'redux-thunk',
      'react-css-modules',
      'lodash',
      'redux-form',
      'redux-logger',
      'redux',
      'react',
      'react-dom',
      'react-redux',
      'react-router'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'http://localhost:3000/dist/',
    filename: '[name].js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true,
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
      selectedChunks: Infinity
    })
  ],
  resolve: {
    root: path.resolve(__dirname, 'src/app/js'),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
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
          'resolve-url?sourceMap',
          'sass?outputStyle=expanded&sourceMap'
        ],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.sass$/,
        exclude: /node_modules/,
        loaders: [
          'style',
          'css?modules&sourceMap&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          'resolve-url?sourceMap',
          'sass?indentedSyntax&sourceMap'
        ],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.woff(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2'
      },
      {
        test: /\.otf(\?.*)?$/,
        loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype'
      },
      {
        test: /\.ttf(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?.*)?$/,
        loader: 'file?prefix=fonts/&name=[path][name].[ext]'
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=8192'
      }
    ]
  }
};
