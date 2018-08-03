const webpackMerge = require('webpack-merge');
const path = require('path')
const resolve = function () {
  console.log(path.resolve(__dirname, ...arguments))
  return path.resolve(__dirname, ...arguments)
}
resolve('../hap-tool/')
var obj = {
  output: {
    path: '../test',
    alias: {
      test: 'test'
    }
  },
  module: {
    rules: ['1111', 123]
  },
  plugins: [
    new String()
  ]
}

var obj2 = {
  output: {
    path: '../test2',
    alias: {
      test2: 'test2'
    },
    filename: '../test'
  },
  module: {
    rules: ['1111', 1234]
  },
  plugins: [
    new String(),
    new Function()
  ]
}

console.log(webpackMerge(obj, obj2))