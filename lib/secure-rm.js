const rimraf = require('rimraf')
const { methods, eventEmitter } = require('./methods')

function secureRm (path, methodID, callback) {
  if (callback === undefined && typeof methodID === 'function') {
    callback = methodID
    methodID = null
  }
  if (callback) {
    if (Array.from(methods.keys()).includes(methodID) || methodID == null) {
      rimraf(path, { unlink: methods[methodID || 0].method }, (err) => callback(err, path))
    } else {
      callback(new Error(`${methodID} is not a valid ID. \nList of valid IDs: ${Array.from(methods.keys())}`))
    }
  } else {
    return new Promise((resolve, reject) => {
      if (Array.from(methods.keys()).includes(methodID) || methodID == null) {
        rimraf(path, { unlink: methods[methodID || 0].method }, (err) => {
          if (err) reject(err)
          else resolve(path)
        })
      } else {
        reject(new Error(`${methodID} is not a valid ID. \nList of valid IDs: ${Array.from(methods.keys())}`))
      }
    })
  }
}

secureRm.event = eventEmitter

module.exports = secureRm
