const rimraf = require('rimraf')
const { methods, eventEmitter } = require('./methods')

function secureRm (path, method, callback) {
  if (callback === undefined) {
    callback = method
    method = 0
  }
  rimraf(path, methods[method].customFs, (err) => callback(err))
}

secureRm.event = eventEmitter

module.exports = secureRm
