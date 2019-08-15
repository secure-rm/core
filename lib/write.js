const fs = require('fs')
const path = require('path')
const events = require('events')
const crypto = require('crypto')
const { kMaxLength } = require('buffer')

const eventEmitter = new events.EventEmitter()

const offset = (arr, offset) => [...arr.slice(offset), ...arr.slice(0, offset)]

const write = {
  init: file => {
    return new Promise((resolve, reject) => {
      fs.stat(file, (err, stats) => {
        if (err) reject(err)
        else if (stats.size <= kMaxLength) {
          eventEmitter.emit('start', file)
          resolve({ fileSize: stats.size, file })
        } else {
          reject(Error('64bit files are not yet supported.'))
        }
      })
    })
  },
  random: (file, fileSize, passes) => {
    return new Promise((resolve, reject) => {
      const buffer = Buffer.alloc(fileSize)
      crypto.randomFill(buffer, (err, randomBuffer) => {
        if (err) reject(err)
        eventEmitter.emit('info', file, 'Writing random data ')
        fs.writeFile(file, randomBuffer, (err) => {
          if (err) reject(err)
          else if (passes > 1) {
            write.random(file, fileSize, passes - 1)
              .then(() => resolve({ fileSize, file }))
              .catch((err) => reject(err))
          } else resolve({ fileSize, file })
        })
      })
    })
  },
  zeroes: (file, fileSize, passes) => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('info', file, 'Writing zeroes ')
      fs.writeFile(file, Buffer.alloc(fileSize, 0), (err) => {
        if (err) reject(err)
        else if (passes > 1) {
          write.zeroes(file, fileSize, passes - 1)
            .then(() => resolve({ fileSize, file }))
            .catch((err) => reject(err))
        } else resolve({ fileSize, file })
      })
    })
  },
  ones: (file, fileSize, passes) => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('info', file, 'Writing ones ')
      fs.writeFile(file, Buffer.alloc(fileSize, 0b11111111), (err) => {
        if (err) reject(err)
        else if (passes > 1) {
          write.ones(file, fileSize, passes - 1)
            .then(() => resolve({ fileSize, file }))
            .catch((err) => reject(err))
        } else resolve({ fileSize, file })
      })
    })
  },
  byte: (file, data, fileSize, passes) => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('info', file, `Writing 0x${data.toString(16)} `)
      fs.writeFile(file, Buffer.alloc(fileSize, data), (err) => {
        if (err) reject(err)
        else if (passes > 1) {
          write.byte(file, data, fileSize, passes - 1)
            .then(() => resolve({ fileSize, file }))
            .catch((err) => reject(err))
        } else resolve({ fileSize, file })
      })
    })
  },
  bytes: (file, dataArray, fileSize, passes) => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('info', file, `Writing ${dataArray.map(x => '0x' + x.toString(16))} `)
      const dataConverted = Uint8Array.from(dataArray)
      fs.writeFile(file, Buffer.alloc(fileSize, dataConverted), (err) => {
        if (err) reject(err)
        else if (passes > 1) {
          write.bytes(file, dataArray, fileSize, passes - 1)
            .then(() => resolve({ fileSize, file }))
            .catch((err) => reject(err))
        } else resolve({ fileSize, file })
      })
    })
  },
  cycleBytes: (file, dataArray, fileSize, passes = 1) => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('info', file, `Writing ${dataArray.map(x => '0x' + x.toString(16))} `)
      const dataConverted = Uint8Array.from(dataArray)
      fs.writeFile(file, Buffer.alloc(fileSize, dataConverted), (err) => {
        if (err) reject(err)
        else if (passes < dataArray.length) {
          write.cycleBytes(file, offset(dataArray, 1), fileSize, passes + 1)
            .then(() => resolve({ fileSize, file }))
            .catch((err) => reject(err))
        } else resolve({ fileSize, file })
      })
    })
  },
  incrementByte: (file, { start, end, increment }, fileSize) => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('info', file, `Writing 0x${start.toString(16)} `)
      fs.writeFile(file, Buffer.alloc(fileSize, start), (err) => {
        if (err) reject(err)
        else if (start + increment <= end) {
          write.incrementByte(file, { start: start + increment, end: end, increment }, fileSize)
            .then(() => resolve({ fileSize, file }))
            .catch((err) => reject(err))
        } else resolve({ fileSize, file })
      })
    })
  },
  randomByte: (file, fileSize, passes) => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('info', file, 'Writing random byte ')
      fs.writeFile(file, Buffer.alloc(fileSize, crypto.randomBytes(1)[0]), (err) => {
        if (err) reject(err)
        else if (passes > 1) {
          write.randomByte(file, fileSize, passes - 1)
            .then(() => resolve({ fileSize, file }))
            .catch((err) => reject(err))
        } else resolve({ fileSize, file })
      })
    })
  },
  complementary: (file, fileSize) => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('info', file, 'Reading file ')
      fs.readFile(file, (err, data) => {
        if (err) reject(err)
        else {
          eventEmitter.emit('info', file, 'Getting binary complement ')
          for (let i = 0, l = fileSize; i < l; i++) {
            data[i] = ~data[i]
          }
          eventEmitter.emit('info', file, 'Writing binary complement ')
          fs.writeFile(file, data, (err) => {
            if (err) reject(err)
            else resolve({ fileSize, file })
          })
        }
      })
    })
  },
  rename: (file, fileSize) => {
    return new Promise((resolve, reject) => {
      const newName = Math.random().toString(36).substring(2, 15)
      const newPath = path.join(path.dirname(file), newName)
      eventEmitter.emit('info', file, `Renaming to ${newName} `)
      fs.rename(file, newPath, (err) => {
        if (err) reject(err)
        else resolve({ fileSize, file: newPath })
      })
    })
  },
  truncate: (file, fileSize) => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('info', file, 'Truncating ')
      const newSize = Math.floor((Math.random() * 0.5 + 0.25) * fileSize)
      fs.truncate(file, newSize, (err) => {
        if (err) reject(err)
        else resolve({ fileSize: newSize, file })
      })
    })
  },
  unlink: file => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('unlink', file)
      fs.unlink(file, (err) => {
        if (err) reject(err)
        else {
          eventEmitter.emit('done', file)
          resolve()
        }
      })
    })
  }
}

module.exports = { write, eventEmitter }
