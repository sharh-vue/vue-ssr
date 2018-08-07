const chokidar = require("chokidar");
const path = require('path');
const fs = require('fs');
const prettier = require("prettier");
const glob = require('glob');

const cwd = path.resolve(__dirname, '../../pages')
let routes = [];

// 监听文件目录
chokidar
  .watch("**/*", {
    // 设定工作目录为pages目录
    cwd: cwd
  })
  // 当添加文件监听的时候会触发此回调，目录下的文件都会被监听
  .on("add", function(filepath) {
    // console.log("add", filepath);
    createRoute(filepath);
  })
  // 文件被删除的时候触发此回调
  .on("unlink", function(filepath) {
    // console.log("unlink", filepath);
    removeRoute(filepath);
  });

/**
 * 创建路由
 * @param {String} filepath 
 */

function createRoute(filepath) {
  // 过滤到\，windows路径显示的是\，替换为/
  var filename = filepath.replace(/\.vue$/, "").replace(/\\/gim, "/");
  // 命名以：目录名+_+文件名
  var routename = filename.replace(/\//gim, '_');
  var routepaths = filename.split(/\//gim);
  var pathNames = routepaths.map(function (routePath, index) {
    routePath = routePath.replace(/^_+/, '_');
    if(routePath.indexOf('_') === 0){
      // 下划线来表示动态路由参数的路径
      routePath = ':'+routePath.replace('_', '')+'?';
    }
    return routePath;
  })
  // 这里只构建路由对象，实际产生的文件还是以写入为准，写入要写字符串
  var route = { 
    pathName: pathNames.join('/'),
    filePath: "~/pages/" + filename,
    chunkName: routename,
    name: routename
  };
  if(route.pathName === '404'){//404页面
    route.pathName = '*';
    routes.push(route);
  }else if(route.pathName === 'index'){//首页
    var indexRoute = Object.assign({}, route);
    indexRoute.pathName = '';
    indexRoute.name = 'baseIndex';
    routes.unshift(indexRoute);
    routes.unshift(route);
  }else{
    routes.unshift(route);
  }
  writeRoutes(routes);
}
/**
 * 删除指定的路由
 * @param {String} filepath 
 */

function removeRoute(filepath) {
  var filename = filepath.replace(/\.vue$/, "").replace(/\\/gim, '_');
  // 找到被删除的文件，将路径也删掉
  var removedIndex = routes.findIndex(function (item, index) {
    return item.name === filename;
  });
  console.log('removedRouteIndex', removedIndex)
  routes.splice(removedIndex, 1);
  writeRoutes(routes);
}

function writeRoutes(routes) {
// 标准的vue-router前缀，导出一个function
var content = 
`
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter(){

  return new Router({
    mode: 'history',
    fallback: false,
    routes: [${getRoutes(routes)}]
  })
}
`;
  //写入文件，在写入之前对代码进行格式化(prettier) 
  fs.writeFile(path.resolve(__dirname, '../../routes/index.js'), prettier.format(content, {parser: "babylon"}), function (err) {
    if(err){
      console.error('router generated failed.')
      return console.error(err);
    }
    console.log('router generated success.')
  });
}
/**
 * 产生路由数组
 * @param {Array} routes 
 */

function getRoutes(routes) {
  var str = [];
  for(let route of routes){
    // webpackChunkName是使用webpack打包时的分块名称，给每个路由都加上自己的名字
    var routeContent = `
    {
      path: "/${route.pathName}",
      component: () => import(/* webpackChunkName: "${route.chunkName}" */ "${route.filePath}"),
      name: "${route.name}"
    }
    `;
    str.push(routeContent)
  }
  return str.join(',');
}


module.exports.buildRouter = function () {
  glob.sync("**/*.vue", {cwd}, function (err, files) {
    if(err){
      return console.log(err);
    }
    files.map(async (filepath) => {
      createRoute(filepath);
    })
  })
}