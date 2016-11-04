import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';

export default merge(baseConfig, {
  devtool: 'source-map',
  entry: ['babel-polyfill', './src/main.development'],
  output: {
    path: __dirname,
    filename: './src/main.js'
  },
  plugins: [
    // Minify the output
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    // Add source map support for stack traces in node
    // https://github.com/evanw/node-source-map-support
    // new webpack.BannerPlugin(
    //   'require("source-map-support").install();',
    //   { raw: true, entryOnly: false }
    // ),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  target: 'electron-main',
  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false
  },

  externals: [
    // 'source-map-support'
  ]
});

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