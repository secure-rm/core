const rimraf = require('rimraf')
const { methods, eventEmitter } = require('./methods')
const { write } = require('./write')

// List of valid methods IDs
const validIDs = Array.from(Object.keys(methods))

// Main function when secure-rm is called
function secureRm (path, options, callback) {
  // Parse if callback is provided
  if (callback === undefined && typeof options === 'function') {
    callback = options
    options = { method: 'secure' }
  }
  // Define method if none is provided
  if (options.method == null) options.method = 'secure'

  if (callback) secureRmCallback(path, options, (err, path) => callback(err, path))
  else return secureRmPromise(path, options)
}

// Callback version
function secureRmCallback (path, options, callback) {
  if (options.customMethod) {
    rimraf(path, {
      unlink: options.customMethod,
      maxBusyTries: options.maxBusyTries || 3,
      disableGlob: options.disableGlob || false
    }, (err) => callback(err, path))
  } else if (validIDs.includes(options.method)) {
    rimraf(path, {
      unlink: methods[options.method].method,
      maxBusyTries: options.maxBusyTries || 3,
      disableGlob: options.disableGlob || false
    }, (err) => callback(err, path))
  } else {
    callback(new Error(`'${options.method}' is not a valid ID. \nList of valid IDs: ${validIDs}`))
  }
}

// Promise version
function secureRmPromise (path, options) {
  return new Promise((resolve, reject) => {
    if (options.customMethod) {
      rimraf(path, {
        unlink: options.customMethod,
        maxBusyTries: options.maxBusyTries || 3,
        disableGlob: options.disableGlob || false
      }, (err) => {
        if (err) reject(err)
        else resolve(path)
      })
    } else if (validIDs.includes(options.method)) {
      rimraf(path, {
        unlink: methods[options.method].method,
        maxBusyTries: options.maxBusyTries || 3,
        disableGlob: options.disableGlob || false
      }, (err) => {
        if (err) reject(err)
        else resolve(path)
      })
    } else {
      reject(new Error(`'${options.method}' is not a valid ID. \nList of valid IDs: ${validIDs}`))
    }
  })
}

secureRm.event = eventEmitter
secureRm.write = write

module.exports = secureRm
