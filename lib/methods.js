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
          if (err) console.log(err)
          if (stats.size <= kMaxLength) {
            eventEmitter.emit('info', file, 'Generating data ')
            let buff = Buffer.alloc(stats.size)
            crypto.randomFill(buff, (err, buff) => {
              if (err) console.log(err)
              eventEmitter.emit('writing', file)
              fs.writeFile(file, buff, (err) => {
                if (err) console.log(err)
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
          if (err) console.log(err)
          eventEmitter.emit('writing', file)
          if (stats.size <= kMaxLength) {
            fs.writeFile(file, Buffer.alloc(stats.size, 0), (err) => {
              if (err) console.log(err)
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
  }
  /* {
      name: 'Russian GOST P50739-95',
  } */
]

module.exports = { methods, eventEmitter }
