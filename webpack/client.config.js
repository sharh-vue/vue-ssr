const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SWPrecachePlugin = require('sw-precache-webpack-plugin');


const baseConfig = require("./base.config.js");
const utils = require('./utils/index.js');
const isDev = !process.env.BUILD_ENV;

module.exports = webpackMerge(baseConfig, {
  entry: {
    client: utils.resolve(__dirname, "../app/entry-client.js")
  },
  output: {
    path: utils.resolve(__dirname, "../build/dist")
  },
  devtool: isDev ? "source-map" : "none",
  devServer: {
    contentBase: utils.resolve(__dirname, "../build"),
    compress: true,
    port: 9000,
    host: "0.0.0.0",
    disableHostCheck: true
  },
  // 只在客服端进行这样处理，服务器端还是不要做这样处理，vue-ssr会报错
  optimization: {
    // 定义process.NODE_ENV到全局环境
    nodeEnv: isDev ? 'development' : 'production',
    minimize: isDev ? false : true,
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    },
    splitChunks: {
      chunks: 'all',
      // 产生块的最小的文件体积，byte单位
      minSize: 30000,
      // 最大的文件体积，byte单位
      maxSize: 100000,
      // 分割前，模块中共享的，最小的块数
      minChunks: 2,
      // 按需加载最大请求数
      maxAsyncRequests: 5,
      // 在一个入口（entry）最大的并行请求数
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        common: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(["build/dist"], {
      root: utils.resolve(__dirname, '..')
    }),
    new SWPrecachePlugin({
      cacheId: 'my-project',
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      minify: true,
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    new VueSSRClientPlugin({
      filename: '../vue-ssr-client-manifest.json'
    })
  ]
});