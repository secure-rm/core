const fs = require('fs')
const { kMaxLength } = require('buffer')
const { write, eventEmitter } = require('./write')

function logError (err, file) {
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
        // break
    }
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
            eventEmitter.emit('start', file)
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
            eventEmitter.emit('start', file)
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
            eventEmitter.emit('start', file)
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
            eventEmitter.emit('start', file)
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
    name: 'Russian State Standard GOST R 50739-95',
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
            eventEmitter.emit('start', file)
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
            eventEmitter.emit('start', file)
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
            eventEmitter.emit('start', file)
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
    name: '*Secure-rm method*',
    passes: 4,
    description:
      `Pass 1-2: Overwriting with random data;
Pass 3: Renaming the file with random data;
Pass 4: Truncating between 25% and 75% of the file.`,
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          const callback = (err) => { cb(err); logError(err, file) }
          if (err) callback(err)
          else {
            eventEmitter.emit('start', file)
            if (stats.size <= kMaxLength) {
              write.random(file, stats, 2, (err) => {
                if (err) callback(err)
                else {
                  write.rename(file, stats, (err, file) => {
                    if (err) callback(err)
                    else {
                      write.truncate(file, stats, (err) => {
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
    name: 'Royal Canadian Mounted Police TSSIT OPS-II',
    passes: 7,
    description:
      `Pass 1: Overwriting with zeroes;
Pass 2: Overwriting with ones;
Pass 3-6: Same as 1-2;
Pass 7: Overwriting with a random data as well as review the writing of this character.`,
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          const callback = (err) => { cb(err); logError(err, file) }
          if (err) callback(err)
          else {
            eventEmitter.emit('start', file)
            if (stats.size <= kMaxLength) {
              write.zeroes(file, stats, (err) => {
                if (err) callback(err)
                else {
                  write.ones(file, stats, (err) => {
                    if (err) callback(err)
                    else {
                      write.zeroes(file, stats, (err) => {
                        if (err) callback(err)
                        else {
                          write.ones(file, stats, (err) => {
                            if (err) callback(err)
                            else {
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
                            }
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
    name: 'Bruce Schneier Algorithm',
    passes: 7,
    description:
      `Pass 1: Overwriting with zeros;
Pass 2: Overwriting with ones;
Pass 3-7: Overwriting with random data.`,
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          const callback = (err) => { cb(err); logError(err, file) }
          if (err) callback(err)
          else {
            eventEmitter.emit('start', file)
            if (stats.size <= kMaxLength) {
              write.zeroes(file, stats, (err) => {
                if (err) callback(err)
                else {
                  write.ones(file, stats, (err) => {
                    if (err) callback(err)
                    else {
                      write.random(file, stats, 5, (err) => {
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
    name: 'Bruce Schneier Algorithm',
    passes: 33,
    description:
      `Pass 1-33: Overwriting with random data.`,
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          const callback = (err) => { cb(err); logError(err, file) }
          if (err) callback(err)
          else {
            eventEmitter.emit('start', file)
            if (stats.size <= kMaxLength) {
              write.random(file, stats, 33, (err) => {
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
    name: 'Peter Gutmann Algorithm',
    passes: 35,
    description:
      `Pass 1-4: Overwriting with random data;
Pass 5: Overwriting with 0x55;
Pass 6: Overwriting with 0xAA;
Pass 7-9: Overwriting with 0x92 0x49 0x24, then cycling through the bytes;
Pass 10-25: Overwriting with 0x00, incremented by 1 at each pass, until 0xFF;
Pass 26-28: Same as 7-9;
Pass 29-31: Overwriting with 0x6D 0xB6 0xDB, then cycling through the bytes;
Pass 32-35: Overwriting with random data.`,
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          const callback = (err) => { cb(err); logError(err, file) }
          if (err) callback(err)
          else {
            eventEmitter.emit('start', file)
            if (stats.size <= kMaxLength) {
              write.random(file, stats, 4, (err) => {
                if (err) callback(err)
                else {
                  write.cycleByte(file, [0x92, 0x49, 0x24], stats, (err) => {
                    if (err) callback(err)
                    else {
                      write.incrementByte(file, { start: 0x00, end: 0xFF }, stats, (err) => {
                        if (err) callback(err)
                        else {
                          write.cycleByte(file, [0x92, 0x49, 0x24], stats, (err) => {
                            if (err) callback(err)
                            else {
                              write.cycleByte(file, [0x6D, 0xB6, 0xDB], stats, (err) => {
                                if (err) callback(err)
                                else {
                                  write.random(file, stats, 4, (err) => {
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
  }/* {
    name: 'Template',
    passes: 3,
    description:
      `description`,
    customFs: {
      unlink: function (file, cb) {
        return fs.stat(file, (err, stats) => {
          const callback = (err) => { cb(err); logError(err, file) }
          if (err) callback(err)
          else {
            eventEmitter.emit('start', file)
            if (stats.size <= kMaxLength) {
              write.random(file, stats, (err) => {
                if (err) callback(err)
                else {

                }
              })
            } else {
              eventEmitter.emit('error', file, '64bit files are not yet supported.')
            }
          }
        })
      }
    }
  }, */
]

module.exports = { methods, eventEmitter }
