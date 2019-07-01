const rimraf = require('rimraf')
const { methods } = require('./methods')

function secureRm (path, method, callback) {
  rimraf(path, methods[method].customFs, (err) => callback(err))
}

module.exports = secureRm
