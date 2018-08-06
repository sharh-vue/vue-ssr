
const FriendLyErrorPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { VueLoaderPlugin } = require('vue-loader');
const utils = require('./utils/index.js');

const getCssLoader = (importLoaders) => {
  var loader = {
    loader: 'css-loader',
    options: {
      alias: {
        // 在css中使用~/assets，对应alias一样的操作，注意使用0.28.x版本
        '/static': utils.resolve(__dirname, '../static'),
        '/assets': utils.resolve(__dirname, '../assets')
      },
      importLoaders: 1
    }
  }
  if(importLoaders != null){
    loader.options.importLoaders = importLoaders;
  }
  return loader
}

const isDev = !process.env.BUILD_ENV;

let plugins = [
  new FriendLyErrorPlugin(),
  new VueLoaderPlugin()
]

if(!isDev){
  plugins.push(
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/chunks/[id].css"
    })
  )
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  output: {
    path: utils.resolve(__dirname, '../build'),
    publicPath: '',
    // 注意要以.js结尾，不然会有错误，所有的文件处理都是以js为基础
    filename: '[name].[chunkhash:5].js',
    // 除了entry外，动态分包的文件名，比如import()这样动态引入的
    chunkFilename: '[name].[chunkhash:5].js',
  },
  resolve: {
    alias: {
      '~': utils.resolve(__dirname, '..'),
      '~~': utils.resolve(__dirname, '..'),
      '@': utils.resolve(__dirname, '..'),
      '@@': utils.resolve(__dirname, '..'),
      'static': utils.resolve(__dirname, '../static/'),
      'assets': utils.resolve(__dirname, '../assets/'),
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.vue', '.js', '.json', '.css', '.less']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader'
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        // 必须引入vue-style-loader，否则开发模式下无法注入css样式
        use: [
          isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          getCssLoader(), 
          'postcss-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader, 
          getCssLoader(), 
          'less-loader'
        ]
      },
      {
        test: /\.postcss$/,
        use: [
          isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          getCssLoader(), 
          'postcss-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000, // 1 KO
          name: 'img/[name].[hash:5].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000, // 1 KO
          name: 'fonts/[name].[hash:5].[ext]'
        }
      },
      {
        test: /\.(webm|mp4)$/,
        loader: 'file-loader',
        options: {
          limit: 10000, // 1 KO
          name: 'videos/[name].[hash:5].[ext]'
        }
      }
    ]
  },
  plugins: plugins
}