const path = require('path');

const resolve = function () {
  return path.resolve(...arguments)
}


module.exports.resolve = resolve;