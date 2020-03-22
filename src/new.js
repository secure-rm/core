const fs = require('fs-extra')
const { kMaxLength } = require('buffer')

var myFs = {
  unlink: function (file, cb) {
    console.log(file)
    fs.stat(file)
      .then(stats => initWriteExtended(file, 0b00000000, stats.size))
      .then(() => fs.unlink(file, cb))
      .catch(cb)
  },
  glob: { dot: true }
}

function initWriteExtended (file, data, size) {
  return fs.open(file, 'w')
    .then(fd => writeExtended(fd, data, size, 0))
}

function writeExtended (fd, data, size, pos) {
  if (size - pos <= kMaxLength) {
    return fs.write(fd, Buffer.alloc(size, data), pos)
      .then(() => fs.close(fd))
  }
  return fs.write(fd, Buffer.alloc(kMaxLength, data), pos)
    .then(() => writeExtended(fd, data, size, pos + kMaxLength))
}

fs.remove('./trash/node_modules/', myFs)
  .then(() => {
    console.log('success!')
  })
  .catch(err => {
    console.error(err + new Error().stack)
  })
