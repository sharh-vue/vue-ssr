const fs = require('fs');
const path = require('path');
const Express = require('express');
const Vue = require('vue');
const VueServerRender = require('vue-server-renderer');
const morgan = require('morgan');

// const render = VueServerRender.createRenderer({
//   template: fs.readFileSync(path.resolve(__dirname, '../commons/template/app.template.html'), 'utf-8')
// });


const render2 = VueServerRender.createBundleRenderer(require('../build/vue-ssr-server-bundle.json'), {
  runInNewContext: false, // 推荐
  template: fs.readFileSync(path.resolve(__dirname, '../app.template.html'), 'utf-8'), // （可选）页面模板
  clientManifest: require('../build/vue-ssr-client-manifest.json') // （可选）客户端构建 manifest
})


const app = Express();

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const PORT = process.env.PORT || 9500;

app.use(morgan(isDev ? 'dev' : 'combined'))
app.use('/static', Express.static(path.resolve(__dirname, '../static')))
app.use(Express.static(path.resolve(__dirname, '../build/dist')))
app.use(function (req, res, next) {
  console.log(req.url)
  var vueApp = new Vue({
    data: {
      msg: 'server.js'
    },
    template: '<div id="app">{{msg}}</div>'
  })
  const context = { url: req.url }
  render2.renderToString(context, function(err, html){
    if(err){
      res.send(err);
      res.end();
      return
    }
    res.end(html);
  })
  
})

var server = app.listen(PORT, function(){
  console.log('server listen on '+PORT)
});