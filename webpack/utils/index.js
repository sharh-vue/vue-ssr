const path = require('path');
const crypto = require('crypto');

const resolve = function () {
  return path.resolve(...arguments)
}

const secret = 'server-side-render';
const hash = crypto.createHmac('sha256', secret)

const hashStr = function (str) {
  return hash.update(str).digest("hex");
}

module.exports.resolve = resolve;
module.exports.hashStr = hashStr;