const webpack = require('webpack')
const path = require('path')
const chokidar = require('chokidar')
const clientConfig = require('../client.config')
chokidar.watch(path.resolve(__dirname, '../client.config.js'))
.on('change', (filename) => {
  console.log('change', filename)
  update()
})
update()
function update() {
  let clientCompiler = webpack(clientConfig())
  clientCompiler.run(function (err, stats) {
    if(err){
      return console.log(err)
    }
    var jsonStats = stats.toJson();
    jsonStats.errors.forEach(err => console.error(err))
    jsonStats.warnings.forEach(err => console.warn(err))
  })
}