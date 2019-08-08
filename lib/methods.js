const fs = require('fs')
const crypto = require('crypto')
const events = require('events')
const { kMaxLength } = require('buffer')

const eventEmitter = new events.EventEmitter()

const write = {
  random: (file, stats, passes, callback) => {
    if (callback === undefined) {
      callback = passes
      passes = 1
    }
    eventEmitter.emit('info', file, 'Generating random data ')
    let buffer = Buffer.alloc(stats.size)
    crypto.randomFill(buffer, (err, buf) => {
      if (err) callback(err)
      eventEmitter.emit('info', file, 'Writing random data ')
      fs.writeFile(file, buf, (err) => {
        if (passes > 1) {
          write.random(file, stats, passes - 1, (err) => {
            callback(err)
          })
        } else {
          callback(err)
        }
      })
    })
  },
  zeroes: (file, stats, passes, callback) => {
    if (callback === undefined) {
      callback = passes
      passes = 1
    }
    eventEmitter.emit('info', file, 'Writing zeroes ')
    fs.writeFile(file, Buffer.alloc(stats.size, 0), (err) => {
      if (passes > 1) {
        write.zeroes(file, stats, passes - 1, (err) => {
          callback(err)
        })
      } else {
        callback(err)
      }
    })
  },
  ones: (file, stats, passes, callback) => {
    if (callback === undefined) {
      callback = passes
      passes = 1
    }
    eventEmitter.emit('info', file, 'Writing ones ')
    fs.writeFile(file, Buffer.alloc(stats.size, 255), (err) => {
      if (passes > 1) {
        write.ones(file, stats, passes - 1, (err) => {
          callback(err)
        })
      } else {
        callback(err)
      }
    })
  },
  randomByte: (file, stats, passes, callback) => {
    if (callback === undefined) {
      callback = passes
      passes = 1
    }
    eventEmitter.emit('info', file, 'Writing random byte ')
    fs.writeFile(file, Buffer.alloc(stats.size, crypto.randomBytes(1)[0]), (err) => {
      if (passes > 1) {
        write.randomByte(file, stats, passes - 1, (err) => {
          callback(err)
        })
      } else {
        callback(err)
      }
    })
  },
  complementary: (file, _stats, callback) => {
    eventEmitter.emit('info', file, 'Reading file')
    fs.readFile(file, (err, data) => {
      if (err) callback(err)
      eventEmitter.emit('info', file, 'Getting binary complement ')
      for (let i = 0, l = data.length; i < l; i++) {
        data[i] = ~data[i]
      }
      eventEmitter.emit('info', file, 'Writing binary complement ')
      fs.writeFile(file, data, (err) => {
        callback(err)
      })
    })
  },
  delete: (file, callback) => {
    eventEmitter.emit('deleting', file)
    fs.unlink(file, (err) => {
      eventEmitter.emit('ending', file)
      callback(err)
    })
  }
}

const methods = [
  {
    name: 'Pseudorandom data',
    passes: 1,
    description: 'The fastest wiping scheme. Your data is overwritten with random data (if you use a CSPRNG the data is indistinguishable from random noise.)',
    customFs: {
      unlink: function (file, callback) {
        fs.stat(file, (err, stats) => {
          if (err) callback(err)
          eventEmitter.emit('starting', file)
          if (stats.size <= kMaxLength) {
            write.random(file, stats, (err) => {
              if (err) callback(err)
              write.delete(file, (err) => {
                callback(err)
              })
            })
          } else {
            eventEmitter.emit('error', file, '64bit files are not yet supported.')
          }
        })
      }
    }
  },
  {
    name: 'British HMG IS5(Baseline)',
    passes: 1,
    description: 'Your data is overwritten with zeroes.',
    customFs: {
      unlink: function (file, callback) {
        return fs.stat(file, (err, stats) => {
          if (err) callback(err)
          eventEmitter.emit('starting', file)
          if (stats.size <= kMaxLength) {
            write.zeroes(file, stats, (err) => {
              if (err) callback(err)
              write.delete(file, (err) => {
                callback(err)
              })
            })
          } else {
            eventEmitter.emit('error', file, '64bit files are not yet supported.')
          }
        })
      }
    }
  },
  {
    name: 'Russian GOST P50739-95',
    passes: 2,
    description: 'GOST P50739-95 wiping scheme calls for a single pass of zeroes followed by a single pass of random data',
    customFs: {
      unlink: function (file, callback) {
        return fs.stat(file, (err, stats) => {
          if (err) callback(err)
          eventEmitter.emit('starting', file)
          if (stats.size <= kMaxLength) {
            write.zeroes(file, stats, (err) => {
              if (err) callback(err)
              write.random(file, stats, (err) => {
                if (err) callback(err)
                write.delete(file, (err) => {
                  callback(err)
                })
              })
            })
          } else {
            eventEmitter.emit('error', file, '64bit files are not yet supported.')
          }
        })
      }
    }
  },
  {
    name: 'British HMG IS5 (Enhanced)',
    passes: 3,
    description: 'British HMG IS5 (Enhanced) is a three pass overwriting algorithm: first pass – with zeroes, second pass – with ones and the last pass with random data.',
    customFs: {
      unlink: function (file, callback) {
        return fs.stat(file, (err, stats) => {
          if (err) callback(err)
          eventEmitter.emit('starting', file)
          if (stats.size <= kMaxLength) {
            write.zeroes(file, stats, (err) => {
              if (err) callback(err)
              write.ones(file, stats, (err) => {
                if (err) callback(err)
                write.random(file, stats, (err) => {
                  if (err) callback(err)
                  write.delete(file, (err) => {
                    callback(err)
                  })
                })
              })
            })
          } else {
            eventEmitter.emit('error', file, '64bit files are not yet supported.')
          }
        })
      }
    }
  },
  {
    name: 'US Army AR380-19',
    passes: 3,
    description: 'AR380-19 is data wiping scheme specified and published by the U.S. Army. AR380-19 is three pass overwriting algorithm: first pass – with random data, second with a random byte and the third pass with the complement of the 2nd pass',
    customFs: {
      unlink: function (file, callback) {
        return fs.stat(file, (err, stats) => {
          if (err) callback(err)
          eventEmitter.emit('starting', file)
          if (stats.size <= kMaxLength) {
            write.random(file, stats, (err) => {
              if (err) callback(err)
              write.randomByte(file, stats, (err) => {
                if (err) callback(err)
                write.complementary(file, stats, (err) => {
                  if (err) callback(err)
                  write.delete(file, (err) => {
                    callback(err)
                  })
                })
              })
            })
          } else {
            eventEmitter.emit('error', file, '64bit files are not yet supported.')
          }
        })
      }
    }
  },
  {
    name: 'US Department of Defense DoD 5220.22-M (E)',
    passes: 3,
    description: 'DoD 5220.22-M (E) is a three pass overwriting algorithm: first pass – with zeroes, second pass – with ones and the last pass – with random data',
    customFs: {
      unlink: function (file, callback) {
        return fs.stat(file, (err, stats) => {
          if (err) callback(err)
          eventEmitter.emit('starting', file)
          if (stats.size <= kMaxLength) {
            write.zeroes(file, stats, (err) => {
              if (err) callback(err)
              write.ones(file, stats, (err) => {
                if (err) callback(err)
                write.random(file, stats, (err) => {
                  if (err) callback(err)
                  write.delete(file, (err) => {
                    callback(err)
                  })
                })
              })
            })
          } else {
            eventEmitter.emit('error', file, '64bit files are not yet supported.')
          }
        })
      }
    }
  }/* ,
  {
    name: 'US Air Force 5020',
    passes: 3,
    description: 'US Air Force 5020 is a three pass overwriting algorithm with the first pass being that of a random byte, followed by two passes of complement data (shifted 8 and 16 bits right respectively)',
    customFs: {
      unlink: function (file, callback) {
        return fs.stat(file, (err, stats) => {
          if (err) callback(err)
          if (stats.size <= kMaxLength) {
            write.randomByte(file, stats, (err) => {
              if (err) callback(err)
            })
          } else {
            eventEmitter.emit('error', file, '64bit files are not yet supported.')
          }
        })
      }
    }
  } */
  /* {
    name: 'name',
    passes: 1,
    description: 'description',
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          if (err) cb(err)
          if (stats.size <= kMaxLength) {
            //method
          } else {
            eventEmitter.emit('error', file, '64bit files are not yet supported.')
          }
        })
      }
    }
  } */
]

module.exports = { methods, eventEmitter }
