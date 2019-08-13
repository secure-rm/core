const rimraf = require('rimraf')
const { numericalIDs, methods, eventEmitter } = require('./methods')

function secureRm (path, methodID, callback) {
  if (callback === undefined && typeof methodID === 'function') {
    callback = methodID
    methodID = 'secure'
  }
  if (methodID === undefined) methodID = 'secure'
  const ids = Array.from(Object.keys(methods)).concat(Array.from(Array(numericalIDs.length).keys()))
  if (callback) {
    if (ids.includes(methodID)) {
      const method = typeof methodID === 'number'
        ? numericalIDs[methodID].method
        : methods[methodID].method
      rimraf(path, { unlink: method }, (err) => callback(err, path))
    } else {
      callback(new Error(`'${methodID}' is not a valid ID. \nList of valid IDs: ${ids}`))
    }
  } else {
    return new Promise((resolve, reject) => {
      if (ids.includes(methodID)) {
        const method = typeof methodID === 'number'
          ? numericalIDs[methodID].method
          : methods[methodID].method
        rimraf(path, { unlink: method }, (err) => {
          if (err) reject(err)
          else resolve(path)
        })
      } else {
        reject(new Error(`'${methodID}' is not a valid ID. \nList of valid IDs: ${ids}`))
      }
    })
  }
}

secureRm.event = eventEmitter

module.exports = secureRm
