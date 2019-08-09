const fs = require('fs')
const crypto = require('crypto')
const events = require('events')
const { kMaxLength } = require('buffer')

const eventEmitter = new events.EventEmitter()

function logError(err, file) {
  if (err) {
    switch (err.code) {
      case 'EMFILE':
        eventEmitter.emit('warn', file, `Too many open files, cannot ${err.syscall || 'access'}: `)
        break
      case 'ENOENT':
        eventEmitter.emit('warn', file, `This file no longer exists: `)
        break
      case 'EPERM':
        eventEmitter.emit('error', file, `Operation not permitted on this file (${err.syscall}): `)
        break
      default:
        console.log(err)
        throw err
        break
    }
  }
}

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
  complementary: (file, stats, callback) => {
    eventEmitter.emit('info', file, 'Reading file ')
    fs.readFile(file, (err, data) => {
      if (err) callback(err)
      if (data === undefined) callback({ code: 'EMFILE' })
      else {
        eventEmitter.emit('info', file, 'Getting binary complement ')
        for (let i = 0, l = stats.size; i < l; i++) {
          data[i] = ~data[i]
        }
        eventEmitter.emit('info', file, 'Writing binary complement ')
        fs.writeFile(file, data, (err) => {
          callback(err)
        })
      }
    })
  },
  unlink: (file, callback) => {
    eventEmitter.emit('unlinking', file)
    fs.unlink(file, (err) => {
      if (err == undefined) eventEmitter.emit('done', file)
      callback(err)
    })
  }
}

const methods = [
  {
    name: 'Pseudorandom data',
    passes: 1,
    description: 'Your data is overwritten with cryptographically strong pseudo-random data. (The data is indistinguishable from random noise.)',
    customFs: {
      unlink: function (file, cb) {
        fs.stat(file, (err, stats) => {
          const callback = (err) => { cb(err); logError(err, file) }
          if (err) callback(err)
          else {
            eventEmitter.emit('starting', file)
            if (stats.size <= kMaxLength) {
              write.random(file, stats, (err) => {
                if (err) callback(err)
                else {
                  write.unlink(file, (err) => {
                    callback(err)
                  })
                }
              })
            } else {
              eventEmitter.emit('error', file, '64bit files are not yet supported.')
            }
          }
        })
      }
    }
  },
  {
    name: 'Pseudorandom byte',
    passes: 1,
    description: 'Overwriting with a random byte.',
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          const callback = (err) => { cb(err); logError(err, file) }
          if (err) callback(err)
          else {
            eventEmitter.emit('starting', file)
            if (stats.size <= kMaxLength) {
              write.randomByte(file, stats, (err) => {
                if (err) callback(err)
                else {
                  write.unlink(file, (err) => {
                    callback(err)
                  })
                }
              })
            } else {
              eventEmitter.emit('error', file, '64bit files are not yet supported.')
            }
          }
        })
      }
    }
  },
  {
    name: 'Zeroes',
    passes: 1,
    description: 'Overwriting with zeroes.',
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          const callback = (err) => { cb(err); logError(err, file) }
          if (err) callback(err)
          else {
            eventEmitter.emit('starting', file)
            if (stats.size <= kMaxLength) {
              write.zeroes(file, stats, (err) => {
                if (err) callback(err)
                else {
                  write.unlink(file, (err) => {
                    callback(err)
                  })
                }
              })
            } else {
              eventEmitter.emit('error', file, '64bit files are not yet supported.')
            }
          }
        })
      }
    }
  },
  {
    name: 'Ones',
    passes: 1,
    description: 'Overwriting with ones.',
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          const callback = (err) => { cb(err); logError(err, file) }
          if (err) callback(err)
          else {
            eventEmitter.emit('starting', file)
            if (stats.size <= kMaxLength) {
              write.ones(file, stats, (err) => {
                if (err) callback(err)
                else {
                  write.unlink(file, (err) => {
                    callback(err)
                  })
                }
              })
            } else {
              eventEmitter.emit('error', file, '64bit files are not yet supported.')
            }
          }
        })
      }
    }
  },
  {
    name: 'Russian GOST P50739-95',
    passes: 2,
    description:
      `Pass 1: Overwriting with zeroes;
Pass 2: Overwriting with random data.`,
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          const callback = (err) => { cb(err); logError(err, file) }
          if (err) callback(err)
          else {
            eventEmitter.emit('starting', file)
            if (stats.size <= kMaxLength) {
              write.zeroes(file, stats, (err) => {
                if (err) callback(err)
                else {
                  write.random(file, stats, (err) => {
                    if (err) callback(err)
                    else {
                      write.unlink(file, (err) => {
                        callback(err)
                      })
                    }
                  })
                }
              })
            } else {
              eventEmitter.emit('error', file, '64bit files are not yet supported.')
            }
          }
        })
      }
    }
  },
  {
    name: 'British HMG Infosec Standard 5'/*   / Air Force System Security Instructions AFSSI-5020' */,
    passes: 3,
    description:
      `Pass 1: Overwriting with zeroes;
Pass 2: Overwriting with ones;
Pass 3: Overwriting with random data as well as verifying the writing of this data.`,
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          const callback = (err) => { cb(err); logError(err, file) }
          if (err) callback(err)
          else {
            eventEmitter.emit('starting', file)
            if (stats.size <= kMaxLength) {
              write.zeroes(file, stats, (err) => {
                if (err) callback(err)
                else {
                  write.ones(file, stats, (err) => {
                    if (err) callback(err)
                    else {
                      write.random(file, stats, (err) => {
                        if (err) callback(err)
                        else {
                          write.unlink(file, (err) => {
                            callback(err)
                          })
                        }
                      })
                    }
                  })
                }
              })
            } else {
              eventEmitter.emit('error', file, '64bit files are not yet supported.')
            }
          }
        })
      }
    }
  },
  {
    name: 'US Army AR380-19',
    passes: 3,
    description:
      `Pass 1: Overwriting with random data;
Pass 2: Overwriting with a random byte;
Pass 3: Overwriting with the complement of the 2nd pass, and verifying the writing.`,
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          const callback = (err) => { cb(err); logError(err, file) }
          if (err) callback(err)
          else {
            eventEmitter.emit('starting', file)
            if (stats.size <= kMaxLength) {
              write.random(file, stats, (err) => {
                if (err) callback(err)
                else {
                  write.randomByte(file, stats, (err) => {
                    if (err) callback(err)
                    else {
                      write.complementary(file, stats, (err) => {
                        if (err) callback(err)
                        else {
                          write.unlink(file, (err) => {
                            callback(err)
                          })
                        }
                      })
                    }
                  })
                }
              })
            } else {
              eventEmitter.emit('error', file, '64bit files are not yet supported.')
            }
          }
        })
      }
    }
  },
  {
    name: 'US Department of Defense DoD 5220.22-M (E)',
    passes: 3,
    description:
      `Pass 1: Overwriting with zeroes as well as checking the writing;
Pass 2: Overwriting with ones and checking the writing;
Pass 3: Overwriting with random data as well as verifying the writing.`,
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          const callback = (err) => { cb(err); logError(err, file) }
          if (err) callback(err)
          else {
            eventEmitter.emit('starting', file)
            if (stats.size <= kMaxLength) {
              write.zeroes(file, stats, (err) => {
                if (err) callback(err)
                else {
                  write.ones(file, stats, (err) => {
                    if (err) callback(err)
                    else {
                      write.random(file, stats, (err) => {
                        if (err) callback(err)
                        else {
                          write.unlink(file, (err) => {
                            callback(err)
                          })
                        }
                      })
                    }
                  })
                }
              })
            } else {
              eventEmitter.emit('error', file, '64bit files are not yet supported.')
            }
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
