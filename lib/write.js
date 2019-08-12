const fs = require('fs')
const path = require('path')
const events = require('events')
const crypto = require('crypto')

const eventEmitter = new events.EventEmitter()

const offset = (arr, offset) => [...arr.slice(offset), ...arr.slice(0, offset)]

const write = {
  random: (file, stats, passes, callback) => {
    if (callback === undefined) {
      callback = passes
      passes = 1
    }
    eventEmitter.emit('info', file, 'Generating random data ')
    const buffer = Buffer.alloc(stats.size)
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
  byte: (file, data, stats, passes, callback) => {
    if (callback === undefined) {
      callback = passes
      passes = 1
    }
    eventEmitter.emit('info', file, 'Writing ' + data)
    const dataConverted = parseInt(data)
    fs.writeFile(file, Buffer.alloc(stats.size, dataConverted), (err) => {
      if (passes > 1) {
        write.byte(file, stats, passes - 1, (err) => {
          callback(err)
        })
      } else callback(err)
    })
  },
  cycleByte: (file, array, stats, passes, callback) => {
    if (callback === undefined) {
      callback = passes
      passes = 1
    }
    eventEmitter.emit('info', file, `Writing ${array.map(x => '0x' + x.toString(16))} `)
    let dataConverted = Uint8Array.from(array)
    fs.writeFile(file, Buffer.alloc(stats.size, dataConverted), (err) => {
      if (passes < array.length) {
        write.cycleByte(file, offset(array, 1), stats, passes + 1, (err) => {
          callback(err)
        })
      } else callback(err)
    })
  },
  incrementByte: (file, { start, end }, stats, callback) => {
    eventEmitter.emit('info', file, `Writing 0x${start.toString(16)} `)
    fs.writeFile(file, Buffer.alloc(stats.size, start), (err) => {
      if (start < end) {
        write.incrementByte(file, { start: start + 0x11, end: end }, stats, (err) => {
          callback(err)
        })
      } else callback(err)
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
  rename: (file, _stats, callback) => {
    const newName = Math.random().toString(36).substring(2, 15)
    const newPath = path.join(path.dirname(file), newName)
    eventEmitter.emit('info', file, `Renaming to ${newName} `)
    fs.rename(file, newPath, (err) => {
      callback(err, newPath)
    })
  },
  truncate: (file, stats, callback) => {
    eventEmitter.emit('info', file, 'Truncating ')
    const newSize = Math.floor((Math.random() * 0.5 + 0.25) * stats.size)
    fs.truncate(file, newSize, (err) => {
      callback(err)
    })
  },
  unlink: (file, callback) => {
    eventEmitter.emit('unlink', file)
    fs.unlink(file, (err) => {
      if (err == null) eventEmitter.emit('done', file)
      callback(err)
    })
  }
}

module.exports = { write, eventEmitter }
