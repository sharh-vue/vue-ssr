const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar')
const {GenerateSW} = require('workbox-webpack-plugin');

const baseConfig = require("./base.config.js");
const utils = require('./utils/index.js');
const isDev = !process.env.BUILD_ENV;

module.exports = function(){
  return webpackMerge(baseConfig, {
    entry: {
      app: utils.resolve(__dirname, "../app/entry-client.js")
    },
    output: {
      path: utils.resolve(__dirname, "../build/dist")
    },
    devtool: isDev ? "source-map" : "none",
    // devServer: {
    //   contentBase: utils.resolve(__dirname, "../build"),
    //   compress: true,
    //   port: 9000,
    //   host: "0.0.0.0",
    //   disableHostCheck: true
    // },
    // 只在客服端进行这样处理，服务器端还是不要做这样处理，vue-ssr会报错
    optimization: {
      // 定义process.NODE_ENV到全局环境
      nodeEnv: isDev ? 'development' : 'production',
      minimize: isDev ? false : true,
      
      runtimeChunk: {
        name: entrypoint => {
          // console.log(entrypoint)
          return `runtime~${entrypoint.name}`
        }
      },
      splitChunks: {
        chunks: 'all',
        // 隐藏路径信息，这个选项关乎到最终生成的文件名，如果为true，会用hash隐藏路径信息，否则会显示路径信息。只在splitChunks属性下生效
        hidePathInfo: !isDev,
        // 压缩前最小为30kb,产生块的最小的文件体积，byte单位
        minSize: 30000,
        // 压缩前最大为100kb,最大的文件体积，byte单位
        maxSize: 100000,
        // 分割前，模块中共享的，最小的块数
        minChunks: 2,
        // 按需加载最大请求数
        maxAsyncRequests: 5,
        // 在一个入口（entry）最大的并行请求数
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        // 作为chunk.name，只是作为生成文件的前缀，跟下面的cacheGroups下的key定义的name是一样的，如果下面的key没有定义name就用这个name
        // 最终生成的文件名为：name+automaticNameDelimiter+key
        // 这里的key是由：文件路径名+automaticNameDelimiter+hashFilename(loader的完整路径)
        // 最终的key是将路径中的“/”替换为“_”，从而组成。
        // 比如.vue文件，实际的loader路径为：
        // "./node_modules/_vue-loader@15.2.6@vue-loader/lib/index.js?!./pages/user.vue"
        // 这里的_id.vue文件由vue-loader解析，一个完整的解析链路
        // 最终生成的key为：./pages/user.vue~a1da583e => ._pages_user.vue~a1da583e
        // hidePathInfo属性为true的话会使用hashFilename(key)对key加密，最终生成的文件名就是：
        // name+automaticNameDelimiter+hashFilename(key)
        name (module) {
          // module.nameForCondition()可以拿到文件名
          // 不配置name和cacheGroups下的name，会以chunkId作为上面说的name的名称
          return true; //...
        },
        // cacheGroup并不是说会把整个文件打包到name的文件中，而是以name为分组，来作为打包的前缀。
        // 权重：配合test、minChunks
        // maxSize takes higher priority than maxInitialRequest/maxAsyncRequests. Actual priority is maxInitialRequest/maxAsyncRequests < maxSize < minSize.
        cacheGroups: {
          default: false,
          vendors: {
            name: 'vendors',
            minChunks: 1,
            test: /[\\/]node_modules[\\/]/,
            reuseExistingChunk: true,
            priority: 21
          },
          common: {
            // minChunks: 1,
            name: 'common',
            priority: 20,
            reuseExistingChunk: true
          }
        }
      }
    },
    plugins: [
      new CleanWebpackPlugin(["build/dist"], {
        root: utils.resolve(__dirname, '..')
      }),
      // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
      new GenerateSW({
        swDest: 'service-worker.js',
        importWorkboxFrom: 'local',
        include: isDev ? [] : [/\.(png|jpeg|gif|svg|jpg|mp3|mp4|woff|ttf|woff2|html|css|js|html)$/],
        // 不缓存热更新的文件
        exclude: [/hot-update/],
        // 缓存动态路径，比如api请求，页面等。开发模式下由于热更新，缓存页面会导致热更新文件请求不存在。需要注释掉
        runtimeCaching: isDev ? [] : [
          {
            urlPattern: /^\/$/,
            handler: 'networkFirst'
          },
          {
            urlPattern: /users/,
            handler: 'networkFirst'
          }
        ]
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.BUILD_ENV': JSON.stringify(process.env.BUILD_ENV || 'development'),
        'process.env.VUE_ENV': '"client"'
      }),
      new VueSSRClientPlugin({
        filename: '../vue-ssr-client-manifest.json'
      }),
      new webpack.HashedModuleIdsPlugin({
        hashFunction: 'sha256',
        hashDigest: 'hex',
        hashDigestLength: 7
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new WebpackBar({
        name: 'client',
        profile: false
      })
    ]
  });
}