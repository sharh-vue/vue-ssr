const fs = require('fs');
const path = require('path');
const Express = require('express');
const Vue = require('vue');
const VueServerRender = require('vue-server-renderer');
const morgan = require('morgan');

const setupDevServer = require('../build.config');
let render;

function createBundleRenderer(serverBundle, options) {
  render = VueServerRender.createBundleRenderer(serverBundle, options)
  return render;
}



const app = Express();

const isDev = !process.env.BUILD_ENV || process.env.NODE_ENV === 'development';
const PORT = process.env.PORT || 9500;


app.use(morgan(isDev ? 'dev' : 'combined'))
app.use(Express.static(path.resolve(__dirname, '../static')))
app.use(Express.static(path.resolve(__dirname, '../build/dist')))

if(isDev){
  setupDevServer(app, path.resolve(__dirname, '../app.template.html'), createBundleRenderer)
}else{
  render = createBundleRenderer(require('../build/vue-ssr-server-bundle.json'), {
    runInNewContext: false, // 推荐
    template: fs.readFileSync(path.resolve(__dirname, '../app.template.html'), 'utf-8'), // （可选）页面模板
    clientManifest: require('../build/vue-ssr-client-manifest.json') // （可选）客户端构建 manifest
  })
}

app.use(function (req, res) {
  const context = { url: req.url }
  render.renderToString(context, function(err, html){
    if(err){
      res.send(err.message);
      res.end();
      return
    }
    res.end(html);
  })
  
})

var server = app.listen(PORT, function(){
  console.log('server listen on '+PORT)
});