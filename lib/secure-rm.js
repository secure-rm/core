const rimraf = require('rimraf')
const { methods } = require('./methods')

function secureRm (path, method, callback) {
  if (callback === undefined) {
    callback = method
    method = 1
  }
  rimraf(path, methods[method].customFs, (err) => callback(err))
}

module.exports = secureRm
