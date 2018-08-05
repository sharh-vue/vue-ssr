const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const WebpackBar = require('webpackbar');
const webpackMerge = require('webpack-merge');

const utils = require('./utils/index.js');
const baseConfig = require('./base.config.js');

module.exports = webpackMerge(baseConfig, {
  entry: {
    app: utils.resolve(__dirname, '../app/entry-server.js')
  },
  // This allows webpack to handle dynamic imports in a Node-appropriate
  // fashion, and also tells `vue-loader` to emit server-oriented code when
  // compiling Vue components.
  target: 'node',
  devtool: 'source-map',
  // This tells the server bundle to use Node-style exports
  output: {
    libraryTarget: 'commonjs2'
  },
  optimization: {
    minimize: false
  },
  // https://webpack.js.org/configuration/externals/#function
  // https://github.com/liady/webpack-node-externals
  // Externalize app dependencies. This makes the server build much faster
  // and generates a smaller bundle file.
  externals: nodeExternals({
    // do not externalize dependencies that need to be processed by webpack.
    // you can add more file types here e.g. raw *.vue files
    // you should also whitelist deps that modifies `global` (e.g. polyfills)
    whitelist: /\.css$/
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueSSRServerPlugin(),
    new WebpackBar({
      name: 'server'
    })
  ]
})