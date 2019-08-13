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
        if (err.message === '64bit files are not yet supported.') {
          eventEmitter.emit('error', file, '64bit files are not yet supported.')
        } else {
          console.log(err)
          throw err
        }
        // break
    }
  }
}

let id = 0

const methods = {
  randomData: {
    name: 'Pseudorandom data',
    numericalID: id++,
    passes: 1,
    description: 'Your data is overwritten with cryptographically strong pseudo-random data. (The data is indistinguishable from random noise.)',
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.random(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          logError(err, file)
          callback(err)
        })
    }
  },
  randomByte: {
    name: 'Pseudorandom byte',
    numericalID: id++,
    passes: 1,
    description: 'Overwriting with a random byte.',
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.randomByte(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          logError(err, file)
          callback(err)
        })
    }
  },
  zeroes: {
    name: 'Zeroes',
    numericalID: id++,
    passes: 1,
    description: 'Overwriting with zeroes.',
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.zeroes(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          logError(err, file)
          callback(err)
        })
    }
  },
  ones: {
    name: 'Ones',
    numericalID: id++,
    passes: 1,
    description: 'Overwriting with ones.',
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.ones(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          logError(err, file)
          callback(err)
        })
    }
  },
  RSSGOST: {
    name: 'Russian State Standard GOST R 50739-95',
    numericalID: id++,
    passes: 2,
    description:
      `Pass 1: Overwriting with zeroes;
Pass 2: Overwriting with random data.`,
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.zeroes(file, fileSize))
        .then(({ fileSize, file }) => write.random(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          logError(err, file)
          callback(err)
        })
    }
  },
  BHMGIS: {
    name: 'British HMG Infosec Standard 5'/*   / Air Force System Security Instructions AFSSI-5020' */,
    numericalID: id++,
    passes: 3,
    description:
      `Pass 1: Overwriting with zeroes;
Pass 2: Overwriting with ones;
Pass 3: Overwriting with random data as well as verifying the writing of this data.`,
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.zeroes(file, fileSize))
        .then(({ fileSize, file }) => write.ones(file, fileSize))
        .then(({ fileSize, file }) => write.random(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          logError(err, file)
          callback(err)
        })
    }
  },
  USAAR380: {
    name: 'US Army AR380-19',
    numericalID: id++,
    passes: 3,
    description:
      `Pass 1: Overwriting with random data;
Pass 2: Overwriting with a random byte;
Pass 3: Overwriting with the complement of the 2nd pass, and verifying the writing.`,
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.random(file, fileSize))
        .then(({ fileSize, file }) => write.randomByte(file, fileSize))
        .then(({ fileSize, file }) => write.complementary(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          logError(err, file)
          callback(err)
        })
    }
  },
  secure: {
    name: '**Secure-rm method**',
    numericalID: id++,
    passes: 4,
    description:
      `Pass 1-2: Overwriting with random data;
Pass 3: Renaming the file with random data;
Pass 4: Truncating between 25% and 75% of the file.`,
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.random(file, fileSize, 2))
        .then(({ fileSize, file }) => write.rename(file, fileSize))
        .then(({ fileSize, file }) => write.truncate(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          logError(err, file)
          callback(err)
        })
    }
  },
  RCMPTSSITOPS: {
    name: 'Royal Canadian Mounted Police TSSIT OPS-II',
    numericalID: id++,
    passes: 7,
    description:
      `Pass 1: Overwriting with zeroes;
Pass 2: Overwriting with ones;
Pass 3-6: Same as 1-2;
Pass 7: Overwriting with a random data as well as review the writing of this character.`,
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.zeroes(file, fileSize))
        .then(({ fileSize, file }) => write.ones(file, fileSize))
        .then(({ fileSize, file }) => write.zeroes(file, fileSize))
        .then(({ fileSize, file }) => write.ones(file, fileSize))
        .then(({ fileSize, file }) => write.zeroes(file, fileSize))
        .then(({ fileSize, file }) => write.ones(file, fileSize))
        .then(({ fileSize, file }) => write.random(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          logError(err, file)
          callback(err)
        })
    }
  },
  BSA1: {
    name: 'Bruce Schneier Algorithm',
    numericalID: id++,
    passes: 7,
    description:
      `Pass 1: Overwriting with zeros;
Pass 2: Overwriting with ones;
Pass 3-7: Overwriting with random data.`,
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.zeroes(file, fileSize))
        .then(({ fileSize, file }) => write.ones(file, fileSize))
        .then(({ fileSize, file }) => write.random(file, fileSize, 5))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          logError(err, file)
          callback(err)
        })
    }
  },
  BSA2: {
    name: 'Bruce Schneier Algorithm',
    numericalID: id++,
    passes: 33,
    description:
      `Pass 1-33: Overwriting with random data.`,
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.random(file, fileSize, 33))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          logError(err, file)
          callback(err)
        })
    }
  },
  PGA: {
    name: 'Peter Gutmann Algorithm',
    numericalID: id++,
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
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.random(file, fileSize, 4))
        .then(({ fileSize, file }) => write.byte(file, 0x55, fileSize))
        .then(({ fileSize, file }) => write.byte(file, 0xAA, fileSize))
        .then(({ fileSize, file }) => write.cycleByte(file, [0x92, 0x49, 0x24], fileSize))
        .then(({ fileSize, file }) => write.incrementByte(file, { start: 0x00, end: 0xFF }, fileSize))
        .then(({ fileSize, file }) => write.cycleByte(file, [0x92, 0x49, 0x24], fileSize))
        .then(({ fileSize, file }) => write.cycleByte(file, [0x6D, 0xB6, 0xDB], fileSize))
        .then(({ fileSize, file }) => write.random(file, fileSize, 4))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          logError(err, file)
          callback(err)
        })
    }
  }/*
  T: {
    name: 'Template',
    numericalID: id++,
    passes: 3,
    description:
      `description`,
    method: function (file, callback) {
      write.init(file)
        .then((fileSize) => write.random(file, fileSize))
        .then(() => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          logError(err, file)
          callback(err)
        })
    }
  }, */
}

let numericalIDs = Array(methods.length)

for (let method in methods) {
  numericalIDs[methods[method].numericalID] = methods[method]
}

module.exports = { numericalIDs, methods, eventEmitter }
