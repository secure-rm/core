const { write, eventEmitter } = require('./write')

// Emit event with better message error
function eventError (err, file) {
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

// Object listing every methods
const methods = {
  'randomData': {
    name: 'Pseudorandom data',
    passes: 1,
    description: `Also kwown as "Australian Information Security Manual Standard ISM 6.2.92"
and "New Zealand Information and Communications Technology Standard NZSIT 402" 
Your data is overwritten with cryptographically strong pseudo-random data. (The data is indistinguishable from random noise.)`,
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.random(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          eventError(err, file)
          callback(err)
        })
    }
  },
  'randomByte': {
    name: 'Pseudorandom byte',
    passes: 1,
    description: 'Overwriting with a random byte.',
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.randomByte(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          eventError(err, file)
          callback(err)
        })
    }
  },
  'zeroes': {
    name: 'Zeroes',
    passes: 1,
    description: 'Overwriting with zeroes.',
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.zeroes(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          eventError(err, file)
          callback(err)
        })
    }
  },
  'ones': {
    name: 'Ones',
    passes: 1,
    description: 'Overwriting with ones.',
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.ones(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          eventError(err, file)
          callback(err)
        })
    }
  },
  'secure': {
    name: '**Secure-rm method**',
    passes: 3,
    description:
      `Pass 1: Overwriting with random data;
Pass 2: Renaming the file with random data;
Pass 3: Truncating between 25% and 75% of the file.`,
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.random(file, fileSize))
        .then(({ fileSize, file }) => write.rename(file, fileSize))
        .then(({ fileSize, file }) => write.truncate(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          eventError(err, file)
          callback(err)
        })
    }
  },
  'GOST_R50739-95': {
    name: 'Russian State Standard GOST R50739-95',
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
          eventError(err, file)
          callback(err)
        })
    }
  },
  'HMG_IS5': {
    name: 'British HMG Infosec Standard 5',
    passes: 3,
    description:
      `Also known as "Air Force System Security Instructions AFSSI-5020",
"Standard of the American Department of Defense (DoD 5220.22 M)"
"National Computer Security Center NCSC-TG-025 Standard"
and "Navy Staff Office Publication NAVSO P-5239-26"
Pass 1: Overwriting with zeroes;
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
          eventError(err, file)
          callback(err)
        })
    }
  },
  'AR380-19': {
    name: 'US Army AR380-19',
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
          eventError(err, file)
          callback(err)
        })
    }
  },
  'VSITR': {
    name: 'Standard of the Federal Office for Information Security (BSI-VSITR)',
    passes: 7,
    description:
      `Also known as "Royal Canadian Mounted Police TSSIT OPS-II"
Pass 1: Overwriting with zeroes;
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
          eventError(err, file)
          callback(err)
        })
    }
  },
  'schneier': {
    name: 'Bruce Schneier Algorithm',
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
          eventError(err, file)
          callback(err)
        })
    }
  },
  'pfitzner': {
    name: 'Pfitzner Method',
    passes: 33,
    description:
      `Pass 1-33: Overwriting with random data.`,
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.random(file, fileSize, 33))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          eventError(err, file)
          callback(err)
        })
    }
  },
  'gutmann': {
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
    method: function (file, callback) {
      write.init(file)
        .then(({ fileSize, file }) => write.random(file, fileSize, 4))
        .then(({ fileSize, file }) => write.byte(file, 0x55, fileSize))
        .then(({ fileSize, file }) => write.byte(file, 0xAA, fileSize))
        .then(({ fileSize, file }) => write.cycleBytes(file, [0x92, 0x49, 0x24], fileSize))
        .then(({ fileSize, file }) => write.incrementByte(file, { start: 0x00, end: 0xFF, increment: 0x11 }, fileSize))
        .then(({ fileSize, file }) => write.cycleByte(file, [0x92, 0x49, 0x24], fileSize))
        .then(({ fileSize, file }) => write.cycleByte(file, [0x6D, 0xB6, 0xDB], fileSize))
        .then(({ fileSize, file }) => write.random(file, fileSize, 4))
        .then(({ file }) => write.unlink(file))
        .then(() => callback())
        .catch((err) => {
          eventError(err, file)
          callback(err)
        })
    }
  }/*
  T: {
    name: 'Template',
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

module.exports = { methods, eventEmitter }
