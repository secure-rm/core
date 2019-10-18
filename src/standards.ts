import util from 'util'
import { write, eventEmitter } from './write'

// Emit event with better message error
function eventError (err: NodeJS.ErrnoException, file: string): void {
  if (err) {
    switch (err.code) {
      case 'EMFILE':
        eventEmitter.emit('warn', file, `Too many open files, cannot ${err.syscall || 'access'}: `)
        break
      case 'ENOENT':
        eventEmitter.emit('warn', file, 'This file no longer exists: ')
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

type Callback = (err: NodeJS.ErrnoException | null) => void

interface ArgsUnlinkStandard {
  name?: string
  passes?: number
  description?: string
  method: (file: string, callback: Callback) => void
}

class UnlinkStandard {
  readonly name: string
  readonly passes: number
  readonly description: string
  // FIXME method type is any
  readonly method: any
  constructor ({ name = 'Standard #', passes = 1, description = 'no description', method }: ArgsUnlinkStandard) {
    this.name = name
    this.passes = passes
    this.description = description
    this.method = method
    this.method.__promisify__ = function (file: string) {
      return util.promisify(this.method)
    }
  }
}

// Object listing every standards
const standards = {
  randomData: new UnlinkStandard({
    name: 'Pseudorandom data',
    passes: 1,
    description: `Also kwown as "Australian Information Security Manual Standard ISM 6.2.92"
and "New Zealand Information and Communications Technology Standard NZSIT 402" 
Your data is overwritten with cryptographically strong pseudo-random data. (The data is indistinguishable from random noise.)`,
    method: function (file: string, callback: Callback) {
      write.init(file)
        .then(({ file, fileSize }) => write.random(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback(null))
        .catch((err: NodeJS.ErrnoException) => {
          eventError(err, file)
          callback(err)
        })
    }

  }),
  randomByte: new UnlinkStandard({
    name: 'Pseudorandom byte',
    passes: 1,
    description: 'Overwriting with a random byte.',
    method: function (file: string, callback: Callback) {
      write.init(file)
        .then(({ file, fileSize }) => write.randomByte(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback(null))
        .catch((err: NodeJS.ErrnoException) => {
          eventError(err, file)
          callback(err)
        })
    }
  }),
  zeroes: new UnlinkStandard({
    name: 'Zeroes',
    passes: 1,
    description: 'Overwriting with zeroes.',
    method: function (file: string, callback: Callback) {
      write.init(file)
        .then(({ file, fileSize }) => write.zeroes(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback(null))
        .catch((err: NodeJS.ErrnoException) => {
          eventError(err, file)
          callback(err)
        })
    }
  }),
  ones: new UnlinkStandard({
    name: 'Ones',
    passes: 1,
    description: 'Overwriting with ones.',
    method: function (file: string, callback: Callback) {
      write.init(file)
        .then(({ file, fileSize }) => write.ones(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback(null))
        .catch((err: NodeJS.ErrnoException) => {
          eventError(err, file)
          callback(err)
        })
    }
  }),
  secure: new UnlinkStandard({
    name: '**Secure-rm standard**',
    passes: 3,
    description:
      `Pass 1: Overwriting with random data;
Pass 2: Renaming the file with random data;
Pass 3: Truncating between 25% and 75% of the file.`,
    method: function (file: string, callback: Callback) {
      write.init(file)
        .then(({ file, fileSize }) => write.random(file, fileSize))
        .then(({ file, fileSize }) => write.rename(file, fileSize))
        .then(({ file, fileSize }) => write.truncate(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback(null))
        .catch((err: NodeJS.ErrnoException) => {
          eventError(err, file)
          callback(err)
        })
    }
  }),
  'GOST_R50739-95': new UnlinkStandard({
    name: 'Russian State Standard GOST R50739-95',
    passes: 2,
    description:
      `Pass 1: Overwriting with zeroes;
Pass 2: Overwriting with random data.`,
    method: function (file: string, callback: Callback) {
      write.init(file)
        .then(({ file, fileSize }) => write.zeroes(file, fileSize))
        .then(({ file, fileSize }) => write.random(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback(null))
        .catch((err: NodeJS.ErrnoException) => {
          eventError(err, file)
          callback(err)
        })
    }
  }),
  HMG_IS5: new UnlinkStandard({
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
    method: function (file: string, callback: Callback) {
      write.init(file)
        .then(({ file, fileSize }) => write.zeroes(file, fileSize))
        .then(({ file, fileSize }) => write.ones(file, fileSize))
        .then(({ file, fileSize }) => write.random(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback(null))
        .catch((err: NodeJS.ErrnoException) => {
          eventError(err, file)
          callback(err)
        })
    }
  }),
  'AR380-19': new UnlinkStandard({
    name: 'US Army AR380-19',
    passes: 3,
    description:
      `Pass 1: Overwriting with random data;
Pass 2: Overwriting with a random byte;
Pass 3: Overwriting with the complement of the 2nd pass, and verifying the writing.`,
    method: function (file: string, callback: Callback) {
      write.init(file)
        .then(({ file, fileSize }) => write.random(file, fileSize))
        .then(({ file, fileSize }) => write.randomByte(file, fileSize))
        .then(({ file, fileSize }) => write.complementary(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback(null))
        .catch((err: NodeJS.ErrnoException) => {
          eventError(err, file)
          callback(err)
        })
    }
  }),
  VSITR: new UnlinkStandard({
    name: 'Standard of the Federal Office for Information Security (BSI-VSITR)',
    passes: 7,
    description:
      `Also known as "Royal Canadian Mounted Police TSSIT OPS-II"
Pass 1: Overwriting with zeroes;
Pass 2: Overwriting with ones;
Pass 3-6: Same as 1-2;
Pass 7: Overwriting with a random data as well as review the writing of this character.`,
    method: function (file: string, callback: Callback) {
      write.init(file)
        .then(({ file, fileSize }) => write.zeroes(file, fileSize))
        .then(({ file, fileSize }) => write.ones(file, fileSize))
        .then(({ file, fileSize }) => write.zeroes(file, fileSize))
        .then(({ file, fileSize }) => write.ones(file, fileSize))
        .then(({ file, fileSize }) => write.zeroes(file, fileSize))
        .then(({ file, fileSize }) => write.ones(file, fileSize))
        .then(({ file, fileSize }) => write.random(file, fileSize))
        .then(({ file }) => write.unlink(file))
        .then(() => callback(null))
        .catch((err: NodeJS.ErrnoException) => {
          eventError(err, file)
          callback(err)
        })
    }
  }),
  schneier: new UnlinkStandard({
    name: 'Bruce Schneier Algorithm',
    passes: 7,
    description:
      `Pass 1: Overwriting with zeros;
Pass 2: Overwriting with ones;
Pass 3-7: Overwriting with random data.`,
    method: function (file: string, callback: Callback) {
      write.init(file)
        .then(({ file, fileSize }) => write.zeroes(file, fileSize))
        .then(({ file, fileSize }) => write.ones(file, fileSize))
        .then(({ file, fileSize }) => write.random(file, fileSize, 5))
        .then(({ file }) => write.unlink(file))
        .then(() => callback(null))
        .catch((err: NodeJS.ErrnoException) => {
          eventError(err, file)
          callback(err)
        })
    }
  }),
  pfitzner: new UnlinkStandard({
    name: 'Pfitzner Method',
    passes: 33,
    description:
      'Pass 1-33: Overwriting with random data.',
    method: function (file: string, callback: Callback) {
      write.init(file)
        .then(({ file, fileSize }) => write.random(file, fileSize, 33))
        .then(({ file }) => write.unlink(file))
        .then(() => callback(null))
        .catch((err: NodeJS.ErrnoException) => {
          eventError(err, file)
          callback(err)
        })
    }
  }),
  gutmann: new UnlinkStandard({
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
    method: function (file: string, callback: Callback) {
      write.init(file)
        .then(({ file, fileSize }) => write.random(file, fileSize, 4))
        .then(({ file, fileSize }) => write.byte(file, 0x55, fileSize))
        .then(({ file, fileSize }) => write.byte(file, 0xAA, fileSize))
        .then(({ file, fileSize }) => write.cycleBytes(file, [0x92, 0x49, 0x24], fileSize))
        .then(({ file, fileSize }) => write.incrementByte(file, { start: 0x00, end: 0xFF, increment: 0x11 }, fileSize))
        .then(({ file, fileSize }) => write.cycleBytes(file, [0x92, 0x49, 0x24], fileSize))
        .then(({ file, fileSize }) => write.cycleBytes(file, [0x6D, 0xB6, 0xDB], fileSize))
        .then(({ file, fileSize }) => write.random(file, fileSize, 4))
        .then(({ file }) => write.unlink(file))
        .then(() => callback(null))
        .catch((err: NodeJS.ErrnoException) => {
          eventError(err, file)
          callback(err)
        })
    }
  })/*
  T: new UnlinkStandard({
    name: 'Template',
    passes: 3,
    description:
      `description`,
    method: function (file: string, callback: Callback) {
      write.init(file)
        .then((fileSize) => write.random(file, fileSize))
        .then(() => write.unlink(file))
        .then(() => callback(null))
        .catch((err: NodeJS.ErrnoException) => {
          logError(err, file)
          callback(err)
        })
    }
  }), */
}

// List of valid standards IDs
const validIDs = <unknown>Object.keys(standards) as keyof typeof standards

export { standards, eventEmitter, validIDs, UnlinkStandard }
