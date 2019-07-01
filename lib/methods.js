const fs = require('fs')
const crypto = require('crypto')
const events = require('events')
const { kMaxLength } = require('buffer')

const eventEmitter = new events.EventEmitter()

var methods = [
  {
    name: 'Pseudorandom data',
    passes: 1,
    description: 'The fastest wiping scheme. Your data is overwritten with random data (if you use a CSPRNG the data is indistinguishable from random noise.)',
    customFs: {
      unlink: function (file, cb) {
        fs.stat(file, (err, stats) => {
          if (err) cb(err)
          if (stats.size <= kMaxLength) {
            // Overwrite with random data
            eventEmitter.emit('info', file, 'Generating random data ')
            let buffer = Buffer.alloc(stats.size)
            crypto.randomFill(buffer, (err, buf) => {
              if (err) cb(err)
              eventEmitter.emit('writing', file)
              fs.writeFile(file, buf, (err) => {
                if (err) cb(err)
                // Delete the file
                eventEmitter.emit('deleting', file)
                fs.unlink(file, (err) => {
                  eventEmitter.emit('ending', file)
                  cb(err)
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
    name: 'British HMG IS5(Baseline)',
    passes: 1,
    description: 'Your data is overwritten with zeroes.',
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          if (err) cb(err)
          if (stats.size <= kMaxLength) {
            // Overwrite with zeroes
            eventEmitter.emit('writing', file)
            fs.writeFile(file, Buffer.alloc(stats.size, 0), (err) => {
              if (err) cb(err)
              // Delete the file
              eventEmitter.emit('deleting', file)
              fs.unlink(file, (err) => {
                eventEmitter.emit('ending', file)
                cb(err)
              })
            })
          } else {
            /* let writer = fs.createWriteStream(file, { flags: 'r+'})
            for (let i = 0; i < stats.size; i += kMaxLength) {

            }
            writer.end() */
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
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          if (err) cb(err)
          if (stats.size <= kMaxLength) {
            // Overwrite with zeroes
            eventEmitter.emit('writing', file)
            fs.writeFile(file, Buffer.alloc(stats.size, 0), (err) => {
              if (err) cb(err)
              // Overwrite with random data
              eventEmitter.emit('info', file, 'Generating random data ')
              let buffer = Buffer.alloc(stats.size)
              crypto.randomFill(buffer, (err, buf) => {
                if (err) cb(err)
                eventEmitter.emit('writing', file)
                fs.writeFile(file, buf, (err) => {
                  if (err) cb(err)
                  // Delete the file
                  eventEmitter.emit('deleting', file)
                  fs.unlink(file, (err) => {
                    eventEmitter.emit('ending', file)
                    cb(err)
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
    name: 'British HMG IS5 (Enhanced)',
    passes: 3,
    description: 'British HMG IS5 (Enhanced) is a three pass overwriting algorithm: first pass – with zeroes, second pass – with ones and the last pass with random data.',
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          if (err) cb(err)
          if (stats.size <= kMaxLength) {
            // Overwrite with zeroes
            eventEmitter.emit('writing', file)
            fs.writeFile(file, Buffer.alloc(stats.size, 0), (err) => {
              if (err) cb(err)
              // Overwrite with ones
              eventEmitter.emit('writing', file)
              fs.writeFile(file, Buffer.alloc(stats.size, 1), (err) => {
                if (err) cb(err)
                // Overwrite with random data
                eventEmitter.emit('info', file, 'Generating random data ')
                let buffer = Buffer.alloc(stats.size)
                crypto.randomFill(buffer, (err, buf) => {
                  if (err) cb(err)
                  eventEmitter.emit('writing', file)
                  fs.writeFile(file, buf, (err) => {
                    if (err) cb(err)
                    // Delete the file
                    eventEmitter.emit('deleting', file)
                    fs.unlink(file, (err) => {
                      eventEmitter.emit('ending', file)
                      cb(err)
                    })
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
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          if (err) cb(err)
          if (stats.size <= kMaxLength) {
            // Overwrite with random data
            eventEmitter.emit('info', file, 'Generating random data ')
            let buffer = Buffer.alloc(stats.size)
            crypto.randomFill(buffer, (err, buf) => {
              if (err) cb(err)
              eventEmitter.emit('writing', file)
              fs.writeFile(file, buf, (err) => {
                if (err) cb(err)
                // Overwrite with random data
                eventEmitter.emit('info', file, 'Generating random data ')
                var buffer2 = Buffer.alloc(stats.size)
                crypto.randomFill(buffer2, (err, buf) => {
                  if (err) cb(err)
                  eventEmitter.emit('writing', file)
                  fs.writeFile(file, buf, (err) => {
                    if (err) cb(err)
                    eventEmitter.emit('info', file, 'Getting binary complement ')
                    for (let i = 0, l = buffer2.length; i < l; i++) {
                      buffer2[i] = ~buffer[i]
                    }
                    // Overwrite with complementary
                    eventEmitter.emit('writing', file)
                    fs.writeFile(file, buffer2, (err) => {
                      if (err) cb(err)
                      // Delete the file
                      eventEmitter.emit('deleting', file)
                      fs.unlink(file, (err) => {
                        eventEmitter.emit('ending', file)
                        cb(err)
                      })
                    })
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
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          if (err) cb(err)
          if (stats.size <= kMaxLength) {
            // Overwrite with zeroes
            eventEmitter.emit('writing', file)
            fs.writeFile(file, Buffer.alloc(stats.size, 0), (err) => {
              if (err) cb(err)
              // Overwrite with ones
              eventEmitter.emit('writing', file)
              fs.writeFile(file, Buffer.alloc(stats.size, 1), (err) => {
                if (err) cb(err)
                // Overwrite with random data
                eventEmitter.emit('info', file, 'Generating random data ')
                let buffer = Buffer.alloc(stats.size)
                crypto.randomFill(buffer, (err, buf) => {
                  if (err) cb(err)
                  eventEmitter.emit('writing', file)
                  fs.writeFile(file, buf, (err) => {
                    if (err) cb(err)
                    // Delete the file
                    eventEmitter.emit('deleting', file)
                    fs.unlink(file, (err) => {
                      eventEmitter.emit('ending', file)
                      cb(err)
                    })
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
  /* {
    name: 'US Air Force 5020',
    passes: 3,
    description: 'US Air Force 5020 is a three pass overwriting algorithm with the first pass being that of a random byte, followed by two passes of complement data (shifted 8 and 16 bits right respectively)',
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
