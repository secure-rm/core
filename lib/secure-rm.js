const rimraf = require('rimraf')
const { methods, eventEmitter } = require('./methods')

function secureRm (path, methodID, callback) {
  if (callback === undefined) {
    callback = methodID
    methodID = 0
  }
  if (Array.from(methods.keys()).includes(methodID)) {
    rimraf(path, { unlink: methods[methodID].method }, (err) => callback(err))
  } else {
    callback(new Error(`${methodID} is not a valid ID. \nList of valid IDs: ${Array.from(methods.keys())}`))
  }
}

secureRm.event = eventEmitter

module.exports = secureRm
