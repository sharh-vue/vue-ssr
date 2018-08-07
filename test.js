const glob = require('glob');
const path = require('path');
const cwd = path.resolve(__dirname, 'pages')
glob('**/*.vue',{cwd}, function (err, files) {
  console.log(err, files)
})